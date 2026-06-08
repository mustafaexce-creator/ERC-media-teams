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
    'لماذا اخترت الانضمام',
    'مشروع أثر فيك',
    'ساعات الالتزام الأسبوعية',
    'المرونة في أوقات الطوارئ',
    'الالتزامات التطوعية الأخرى',
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
    'خبرة في المؤثرات البصرية'
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
  
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ تم إنشاء الأعمدة الجديدة بنجاح!', 'جاهز', 5);
}

// ============================================
// Handles form submissions
// ============================================
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),                          // 1: Timestamp
      data.full_name || '',                // 2: الاسم الرباعي
      data.member_id || '',                // 3: رقم العضوية
      data.age || '',                      // 4: السن
      data.phone || '',                    // 5: رقم الهاتف
      data.teams || '',                    // 6: الفرق المختارة
      data.why_join || '',                 // 7: لماذا اخترت الانضمام
      data.inspiring_project || '',        // 8: مشروع أثر فيك
      data.weekly_hours || '',             // 9: ساعات الالتزام الأسبوعية
      data.flexibility || '',              // 10: المرونة في أوقات الطوارئ
      data.other_commitments || '',        // 11: الالتزامات التطوعية الأخرى
      data.content_portfolio || '',        // 12: رابط نماذج المحتوى
      data.content_challenge || '',        // 13: تحدي المحتوى
      data.design_portfolio || '',         // 14: رابط معرض التصميم
      data.design_tools || '',             // 15: أدوات التصميم
      data.design_brand || '',             // 16: التزام بالهوية البصرية
      data.voice_sample || '',             // 17: رابط عينة صوتية
      data.voice_type || '',               // 18: نوع الصوت
      data.photo_portfolio || '',          // 19: رابط صور
      data.photo_equipment || '',          // 20: معدات التصوير
      data.photo_field || '',              // 21: استعداد ميداني
      data.video_portfolio || '',          // 22: رابط فيديوهات
      data.video_tools || '',              // 23: أدوات المونتاج
      data.video_effects || ''             // 24: خبرة في المؤثرات البصرية
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
