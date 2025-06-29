const asyncHandler = require('express-async-handler');
const OpenAI = require('openai'); // Sadece OpenAI'yi bu şekilde import ediyoruz

// Client'ı yeni ve doğru yöntemle başlatıyoruz
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Kullanıcının profiline göre potansiyel roller üretir
// @route   GET /api/nexus/generate
// @access  Private
const generatePotentialRoles = asyncHandler(async (req, res) => {
  const userProfile = req.user;

  const profileSummary = `
    Kullanıcı Başlığı: ${userProfile.headline}
    Yetkinlikler: ${userProfile.skills.join(', ')}
    İlgi Alanları: ${userProfile.interests.map(i => `${i.name} (${i.level})`).join(', ')}
    Geçmiş Deneyimler: ${userProfile.experiences.map(e => `${e.title} at ${e.company}`).join('; ')}
  `;

  const systemPrompt = `
    Sen, 'Potansya' adlı bir kariyer keşfi uygulamasının yapay zeka motorusun.
    Görevin, kullanıcının profil özetini analiz ederek ona en uygun 5 potansiyel kariyer rolü ("gezegen") önermek.
    Her öneri için şu bilgileri sağlamalısın:
    1. 'roleName': Kariyer rolünün adı.
    2. 'description': Bu rolün ne olduğu hakkında 1-2 cümlelik kısa ve ilham verici bir açıklama.
    3. 'suitabilityScore': Kullanıcının mevcut profiline göre bu role olan uygunluğunu 1-100 arasında bir sayı olarak belirt.
    4. 'keyConnections': Kullanıcının hangi yetkinlik veya ilgi alanlarının bu rol ile doğrudan bağlantılı olduğunu belirten 2-3 anahtar kelimelik bir dizi.

    Cevabını, başka hiçbir açıklama yapmadan, doğrudan geçerli bir JSON objesi olarak ver.
    JSON objesi, 'roles' adında bir anahtar içermeli ve bu anahtarın değeri, 5 tane rol objesi içeren bir dizi olmalı.
  `;

  try {
    // API çağrısını yeni ve doğru yöntemle yapıyoruz: .create()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Örnekteki en yeni ve maliyet-etkin modeli kullanalım
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: profileSummary,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });
    
    // Gelen cevabı parse etme şekli aynı kalıyor
    const potentialRoles = JSON.parse(response.choices[0].message.content);
    
    res.status(200).json(potentialRoles);

  } catch (error) {
    // Hata objesinin yapısı v4'te biraz daha farklı olabilir,
    // bu yüzden daha genel bir hata loglaması yapalım.
    console.error('OpenAI API Hatası:', error);
    
    // Eğer hata yine kota hatasıysa, kullanıcıya daha anlamlı bir mesaj verelim
    if (error.code === 'insufficient_quota') {
        res.status(429); // 429 Too Many Requests
        throw new Error('API kotası aşıldı. Lütfen planınızı kontrol edin.');
    }

    res.status(500);
    throw new Error('Potansiyel roller üretilirken bir sunucu hatası oluştu.');
  }
});

module.exports = {
  generatePotentialRoles,
};