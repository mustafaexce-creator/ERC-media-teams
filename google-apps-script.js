// ============================================
// Google Apps Script — paste this in your Apps Script editor
// (Extensions → Apps Script in your Google Sheet)
// ============================================

// ⭐ RUN THIS FUNCTION ONCE to set up your column headers
// Go to the function dropdown at the top → select "setupHeaders" → click ▶ Run
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  var headers = [
    'Timestamp',
    'الاسم الرباعي',
    'رقم العضوية',
    'السن',
    'رقم الهاتف',
    'الفرق المختارة',
    'سبق العمل التطوعي',
    'ساعات الالتزام الأسبوعية',
    'هل يمكن الحضور للتغطيات',
    'ملاحظات إضافية',
    'رابط نماذج المحتوى',
    'تحدي المحتوى',
    'رابط معرض التصميم',
    'أدوات التصميم',
    'التزام بالهوية البصرية',
    'رابط عينة صوتية',
    'نوع الصوت',
    'رابط صور فوتوغرافية',
    'معدات التصوير',
    'استعداد للتصوير الميداني',
    'رابط فيديوهات',
    'أدوات المونتاج',
    'القدرة على إنتاج ريلز'
  ];
  
  // Write headers to Row 1
  var range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  
  // Style the header row
  range.setFontWeight('bold');
  range.setBackground('#E3000F');
  range.setFontColor('#FFFFFF');
  range.setHorizontalAlignment('center');
  range.setWrap(true);
  
  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ تم إنشاء الأعمدة بنجاح!', 'جاهز', 5);
}

// ============================================
// Handles form submissions
// ============================================
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),                          // A: Timestamp
      data.full_name || '',                // B: الاسم الرباعي
      data.member_id || '',                // C: رقم العضوية
      data.age || '',                      // D: السن
      data.phone || '',                    // E: رقم الهاتف
      data.teams || '',                    // F: الفرق المختارة
      data.previous_volunteer || '',       // G: سبق العمل التطوعي
      data.hours_commitment || '',         // H: ساعات الالتزام
      data.can_attend || '',               // I: هل يمكن الحضور
      data.extra_notes || '',              // J: ملاحظات إضافية
      data.content_portfolio || '',        // K: رابط نماذج المحتوى
      data.content_challenge || '',        // L: تحدي المحتوى
      data.design_portfolio || '',         // M: رابط معرض التصميم
      data.design_tools || '',             // N: أدوات التصميم
      data.design_brand || '',             // O: التزام بالهوية البصرية
      data.voice_sample || '',             // P: عينة صوتية
      data.voice_type || '',               // Q: نوع الصوت
      data.photo_portfolio || '',          // R: رابط صور
      data.photo_equipment || '',          // S: معدات التصوير
      data.photo_field || '',              // T: استعداد ميداني
      data.video_portfolio || '',          // U: رابط فيديو
      data.video_tools || '',              // V: أدوات المونتاج
      data.video_reels || ''               // W: القدرة على إنتاج ريلز
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required to handle CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ready' }))
    .setMimeType(ContentService.MimeType.JSON);
}
