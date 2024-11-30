// تحميل الكلمات من ملف JSON
fetch('words.json')
  .then(response => response.json())
  .then(words => {
    const wordList = document.getElementById('word-list');
    
    // إضافة واجهة بحث
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'ابحث عن الكلمة...');
    searchInput.setAttribute('id', 'search');
    document.body.appendChild(searchInput);

    // إضافة تغيير الثيم
    const themeToggle = document.createElement('button');
    themeToggle.innerText = 'التبديل إلى الوضع المظلم';
    themeToggle.id = 'theme-toggle';
    document.body.appendChild(themeToggle);

    // إضافة عناصر التحكم (سرعة الصوت، نغمة الصوت، اللغة)
    const controlPanel = document.createElement('div');
    controlPanel.innerHTML = `
      <label for="speed">سرعة الصوت:</label>
      <input type="range" id="speed" min="0.1" max="2" step="0.1" value="1">
      <label for="pitch">نغمة الصوت:</label>
      <input type="range" id="pitch" min="0" max="2" step="0.1" value="1">
      <label for="language">اختيار اللغة:</label>
      <select id="language">
        <option value="ja-JP">اليابانية</option>
        <option value="en-US">الإنجليزية</option>
      </select>
      <label for="font-size">حجم النص:</label>
      <input type="range" id="font-size" min="12" max="24" value="16">
    `;
    document.body.appendChild(controlPanel);

    // تغيير الثيم
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      themeToggle.innerText = document.body.classList.contains('dark-theme') ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع المظلم';
    });

    // إضافة شريط تقدم لعرض مدة النطق
    const progressBar = document.createElement('progress');
    progressBar.setAttribute('value', '0');
    progressBar.setAttribute('max', '100');
    progressBar.style.width = '100%';
    document.body.appendChild(progressBar);

    // عرض الكلمات على الصفحة
    words.forEach(word => {
      const wordDiv = document.createElement('div');
      wordDiv.classList.add('word-item');
      wordDiv.innerHTML = `
        <p><strong>الكلمة:</strong> ${word.japanese}</p>
        <p><strong>النطق:</strong> ${word.pronunciation}</p>
        <p><strong>المعنى:</strong> ${word.meaning}</p>
      `;
      
      // إضافة تأثيرات عند التفاعل مع الكلمات
      wordDiv.addEventListener('mouseenter', () => {
        wordDiv.style.transform = 'scale(1.05)';
        wordDiv.style.transition = 'transform 0.3s ease';
      });

      wordDiv.addEventListener('mouseleave', () => {
        wordDiv.style.transform = 'scale(1)';
      });

      // إضافة حدث الضغط العادي لتشغيل الصوت
      wordDiv.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(word.pronunciation);
        
        // الحصول على إعدادات الصوت من العناصر
        const speed = document.getElementById('speed').value;
        const pitch = document.getElementById('pitch').value;
        const language = document.getElementById('language').value;
        
        utterance.lang = language;  // تعيين اللغة المختارة
        utterance.rate = speed;  // تعيين سرعة الصوت
        utterance.pitch = pitch;  // تعيين نغمة الصوت

        // إضافة شريط تقدم أثناء النطق
        utterance.onstart = () => {
          progressBar.value = 0;
        };

        utterance.onboundary = (event) => {
          progressBar.value = (event.charIndex / event.utterance.text.length) * 100;
        };

        utterance.onend = () => {
          progressBar.value = 100;
        };

        speechSynthesis.speak(utterance);
      });

      // إضافة حدث الضغط المطول لنسخ النطق
      let pressTimer;
      wordDiv.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
          navigator.clipboard.writeText(word.pronunciation)
            .then(() => {
              alert('تم نسخ النطق إلى الحافظة!');
            })
            .catch(err => {
              console.error('فشل النسخ: ', err);
            });
        }, 1000);  // الوقت اللازم للضغط المطول (1 ثانية)
      });

      wordDiv.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);  // إذا تم رفع الضغط قبل 1 ثانية، لا يتم نسخ النص
      });

      wordDiv.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);  // إذا تم مغادرة العنصر قبل 1 ثانية، لا يتم نسخ النص
      });

      wordList.appendChild(wordDiv);
    });

    // إضافة وظيفة البحث عن الكلمات
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const wordsDivs = wordList.getElementsByClassName('word-item');
      for (let div of wordsDivs) {
        const text = div.innerText.toLowerCase();
        div.style.display = text.includes(query) ? '' : 'none';
      }
    });
  })
  .catch(error => console.error('Error loading words:', error));