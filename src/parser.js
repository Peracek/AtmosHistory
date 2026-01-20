import { XMLParser } from 'fast-xml-parser';

export function parseTemperatures(xmlString) {
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    cdataPropName: '#cdata',
    parseAttributeValue: true,
    trimValues: true,
  });

  const parsed = xmlParser.parse(xmlString);
  const partialResponse = parsed['partial-response'];
  if (!partialResponse?.changes) {
    return { timestamp: new Date() };
  }

  const updates = Array.isArray(partialResponse.changes.update)
    ? partialResponse.changes.update
    : [partialResponse.changes.update];

  // Get HTML from relevant update
  let html = '';
  for (const u of updates) {
    const id = u?.['@_id'] || '';
    if (id.includes('infoPanel') || id.includes('homePartId') || id === 'fDeviceHome') {
      html = u['#text'] || u['#cdata'] || '';
      if (html) break;
    }
  }

  if (!html) {
    return { timestamp: new Date() };
  }

  return parseHtmlData(html);
}

function parseHtmlData(html) {
  const data = { timestamp: new Date() };

  // Parse temperatures from the "Teploty" group (group1)
  // These have format: <div class="item-info-left">AF</div> <div class="item-info-right">-1,0 °C</div>

  // AF - venkovní teplota
  const afMatch = html.match(/<div class="item-info-left">AF<\/div>[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (afMatch) data.af = parseValue(afMatch[1]);

  // WF - teplota vody kotle
  const wfMatch = html.match(/<div class="item-info-left">WF<\/div>[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (wfMatch) data.wf = parseValue(wfMatch[1]);

  // SF - zásobník TUV
  const sfMatch = html.match(/<div class="item-info-left">SF<\/div>[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (sfMatch) data.sf = parseValue(sfMatch[1]);

  // VF1 - okruh 1
  const vf1Match = html.match(/<div class="item-info-left">VF1<\/div>[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (vf1Match) data.vf1 = parseValue(vf1Match[1]);

  // AGF - teplota spalin
  const agfMatch = html.match(/<div class="item-info-left">AGF<\/div>[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (agfMatch) data.agf = parseValue(agfMatch[1]);

  // PF - horní čidlo aku
  const pfMatch = html.match(/<div class="item-info-left">PF<\/div>[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (pfMatch) data.pf = parseValue(pfMatch[1]);

  // PF2 - 2. čidlo aku (in caption, item-info-left shows VI3)
  const pf2Match = html.match(/PF2 - 2\. čidlo aku[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (pf2Match) data.pf2 = parseValue(pf2Match[1]);

  // PF3 - 3. čidlo aku (in caption, item-info-left shows VI2)
  const pf3Match = html.match(/PF3 - 3\. čidlo aku[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (pf3Match) data.pf3 = parseValue(pf3Match[1]);

  // Room temperature - EFWa
  const roomMatch = html.match(/<div class="item-info-left">EFWa<\/div>[\s\S]*?<div class="item-info-right"[^>]*>([^<]+)/);
  if (roomMatch) data.roomTemp = parseValue(roomMatch[1]);

  // Humidity - Vlhkost
  const humidityMatch = html.match(/Vlhkost[\s\S]*?<div class="item-info-right"[^>]*>[^0-9]*(\d+[,.]?\d*)\s*%/);
  if (humidityMatch) data.humidity = parseValue(humidityMatch[1] + '%');

  // Fallback to home page format if no info page data found
  if (Object.keys(data).length <= 1) {
    parseHomePageFormat(html, data);
  }

  return data;
}

function parseHomePageFormat(html, data) {
  // Outdoor temperature from box-temperature
  const outdoorMatch = html.match(/class="box-temperature"[^>]*>.*?<span>([^<]+)</s);
  if (outdoorMatch && !data.af) data.af = parseValue(outdoorMatch[1]);

  // Circuit temperature from currCircuitTempId
  const circuitMatch = html.match(/id="fDeviceHome:currCircuitTempId"[^>]*>([^<]+)</);
  if (circuitMatch && !data.vf1) data.vf1 = parseValue(circuitMatch[1]);

  // Humidity from place-perc
  const humidityMatch = html.match(/class="place-perc"[^>]*>.*?(\d+[,.]?\d*)%/s);
  if (humidityMatch && !data.humidity) data.humidity = parseValue(humidityMatch[1] + '%');
}

function parseValue(value) {
  if (!value) return null;
  value = value.trim();

  // Extract first number (handle "47,2 °C / 20,0 °C" format)
  const match = value.match(/^([+-]?\d+[,.]?\d*)/);
  if (!match) return null;

  // Replace comma with dot
  const normalized = match[1].replace(',', '.');
  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? null : parsed;
}
