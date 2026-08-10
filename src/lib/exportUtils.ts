import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LeaveOpportunity } from '../types/holiday';

/**
 * .ics (iCalendar) Formatında Takvim Dosyası Üretir ve İndirir
 */
export function downloadIcsFile(opportunity: LeaveOpportunity) {
  const formatIcsDate = (dateStr: string) => {
    return dateStr.replace(/-/g, '');
  };

  const dtStart = formatIcsDate(opportunity.startDate);
  const dtEnd = formatIcsDate(opportunity.endDate);

  const formattedLeaveDates = opportunity.leaveDates
    .map((d) => format(parseISO(d), 'd MMMM yyyy (EEEE)', { locale: tr }))
    .join('\\n- ');

  const holidaysText = opportunity.holidaysIncluded.join(', ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hesapli Izin PWA//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:hesapli-izin-${opportunity.id}@hesapli-izin.pwa`,
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:🏖️ Yıllık İzin Tatili: ${opportunity.title}`,
    `DESCRIPTION:Hesaplı İzin PWA ile oluşturuldu.\\n\\nTotal Tatil: ${opportunity.totalOffDays} Gün\\nİzin Maliyeti: ${opportunity.leaveDaysRequired} Gün\\nVerimlilik Skoru: ${opportunity.efficiencyScore}x\\n\\nAlınacak İzin Günleri:\\n- ${formattedLeaveDates}\\n\\nKapsanan Bayramlar: ${holidaysText}`,
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `izin-plan-${opportunity.startDate}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Tüm Fırsatları veya Seçili Fırsatı Excel Uyumlu CSV Formatında İndirir (UTF-8 BOM ile)
 */
export function downloadCsvExport(opportunities: LeaveOpportunity[], year: number) {
  if (opportunities.length === 0) return;

  const headers = [
    'Paket Başlığı',
    'Başlangıç Tarihi',
    'Bitiş Tarihi',
    'Toplam Kesintisiz Tatil (Gün)',
    'İzin Maliyeti (Gün)',
    'Baz İzin Gün Sayısı',
    'Verimlilik Skoru (ROI)',
    'Alınacak İzin Tarihleri',
    'Kapsanan Bayramlar',
    'Cuma Kuralı Uygulandı Mı?',
    'Açıklama',
  ];

  const rows = opportunities.map((opp) => [
    `"${opp.title}"`,
    opp.startDate,
    opp.endDate,
    opp.totalOffDays,
    opp.leaveDaysRequired,
    opp.baseLeaveDays,
    opp.efficiencyScore,
    `"${opp.leaveDates.join(', ')}"`,
    `"${opp.holidaysIncluded.join(', ')}"`,
    opp.hasFridayPenalty ? 'Evet' : 'Hayır',
    `"${opp.scoreReason.replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hesapli-izin-raporu-${year}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * HR İzin Talep Raporu İçin Yazdırma / PDF Penceresini Tetikler
 */
export function triggerPdfPrint(opportunity: LeaveOpportunity) {
  const formattedStart = format(parseISO(opportunity.startDate), 'd MMMM yyyy (EEEE)', { locale: tr });
  const formattedEnd = format(parseISO(opportunity.endDate), 'd MMMM yyyy (EEEE)', { locale: tr });

  const formattedLeaveDates = opportunity.leaveDates
    .map((d) => `<li><strong>${format(parseISO(d), 'd MMMM yyyy (EEEE)', { locale: tr })}</strong></li>`)
    .join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Yıllık İzin Talep Dilekçesi / Raporu - ${opportunity.title}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; color: #0284c7; }
        .date { font-size: 12px; color: #64748b; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 25px; padding: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .stat { background: #ffffff; padding: 12px 18px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .stat-val { font-size: 20px; font-weight: bold; color: #0f172a; }
        .stat-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
        ul { padding-left: 20px; }
        li { margin-bottom: 6px; }
        .footer { margin-top: 50px; text-align: center; border-top: 1px solid #e2e8f0; pt-4; font-size: 12px; color: #94a3b8; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Hesaplıİzin — Yıllık İzin Talebi</div>
        <div class="date">Tarih: ${format(new Date(), 'd MMMM yyyy', { locale: tr })}</div>
      </div>

      <h2>Yıllık İzin Kullanım Raporu</h2>
      <p>Aşağıda belirtilen tarihler arasında yıllık izin kullanımı planlanmıştır:</p>

      <div class="card">
        <h3>İzin Dönemi Özeti</h3>
        <p><strong>Kesintisiz Tatil Aralığı:</strong> ${formattedStart} — ${formattedEnd}</p>
        
        <div class="grid">
          <div class="stat">
            <div class="stat-lbl">Kesintisiz Tatil Günü</div>
            <div class="stat-val">${opportunity.totalOffDays} Gün</div>
          </div>
          <div class="stat">
            <div class="stat-lbl">Harcanacak İzin Günü</div>
            <div class="stat-val">${opportunity.leaveDaysRequired} Gün</div>
          </div>
        </div>

        <h4>Alınması Gereken İzin Günleri (${opportunity.leaveDates.length} Gün):</h4>
        <ul>
          ${formattedLeaveDates}
        </ul>

        ${opportunity.holidaysIncluded.length > 0 ? `<p><strong>Kapsanan Resmî Tatiller:</strong> ${opportunity.holidaysIncluded.join(', ')}</p>` : ''}
      </div>

      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div>
          <p><strong>Çalışan İmza:</strong></p>
          <br><br>
          <p>____________________</p>
        </div>
        <div>
          <p><strong>İnsan Kaynakları / Yönetici Onay:</strong></p>
          <br><br>
          <p>____________________</p>
        </div>
      </div>

      <div class="footer">
        Hesaplı İzin PWA Uygulaması ile Otomatik Oluşturulmuştur.
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Paylaşım Metni Formatlar
 */
export function formatShareText(opportunity: LeaveOpportunity): string {
  const formattedStart = format(parseISO(opportunity.startDate), 'd MMMM yyyy (EEEE)', { locale: tr });
  const formattedEnd = format(parseISO(opportunity.endDate), 'd MMMM yyyy (EEEE)', { locale: tr });
  const formattedLeaveDates = opportunity.leaveDates
    .map((d) => format(parseISO(d), 'd MMMM (EEE)', { locale: tr }))
    .join(', ');

  return `🎉 Yıllık İzin Planım:\n\n📅 Tatil Aralığı: ${formattedStart} - ${formattedEnd}\n🏖️ Toplam Kesintisiz Tatil: ${opportunity.totalOffDays} Gün\n⏱️ Harcanacak İzin: ${opportunity.leaveDaysRequired} Gün\n⚡ Verimlilik Skoru: ${opportunity.efficiencyScore}x\n\n📌 Alınacak İzin Tarihleri: ${formattedLeaveDates}\n\nHesaplı İzin PWA ile hesaplandı: https://hesapli-izin.app`;
}

/**
 * WhatsApp Üzerinden Doğrudan Paylaşır
 */
export function shareOpportunityWhatsApp(opportunity: LeaveOpportunity) {
  const text = formatShareText(opportunity);
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/**
 * Web Share API (Yerel Paylaşım Menüsü) Tetikler
 */
export async function shareOpportunityNative(opportunity: LeaveOpportunity): Promise<boolean> {
  const shareText = formatShareText(opportunity);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `İzin Planı: ${opportunity.title}`,
        text: shareText,
        url: window.location.href,
      });
      return true;
    } catch (err) {
      console.log('Paylaşım iptal edildi veya desteklenmiyor.');
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    return true;
  } catch (err) {
    return false;
  }
}
