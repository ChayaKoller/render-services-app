# render-services-app

אפליקציית שרת פשוטה ב-**Node.js + Express** שמציגה את רשימת השירותים (Services) שמותקנים בחשבון ה-[Render](https://render.com) שלך.

האפליקציה מורכבת משני חלקים:

- **שרת:** endpoint אחד מסוג `GET /services`, שפונה ל-Render API ומחזיר את הרשימה כ-JSON.
- **צד לקוח:** דף HTML שקורא ל-endpoint ומציג כרטיס מסודר לכל שירות.

## מה האפליקציה מציגה

לכל שירות מוצגים, בין היתר: שם, סוג (Web Service, Static Site וכו'), סביבת הרצה, חבילה, סטטוס (פעיל/מושהה), כתובת האתר, ה-Repository וה-Branch, אזור, פריסה אוטומטית, תאריכי יצירה ועדכון וקישור לדשבורד.

## מבנה הפרויקט

```
render-services-app/
├── .api/              # החבילה שנוצרת מתיעוד Render (חובה להעלות ל-GitHub)
├── public/
│   └── index.html     # דף צד הלקוח
├── index.js           # שרת Express
├── package.json
└── README.md
```

## דרישות

- Node.js בגרסה 18 ומעלה
- חשבון ב-Render
- API Key של Render (ראי הסבר למטה)

## יצירת API Key ב-Render

1. היכנסי ל-[Account Settings](https://dashboard.render.com/u/settings) ב-Render.
2. בחלק **API Keys** לחצי **Create API Key**.
3. אם זמינה אפשרות להגדרת הרשאות, בחרי הרשאת **Read** בלבד על **Services**.
4. העתיקי את המפתח מיד. הוא מוצג פעם אחת בלבד.

> ⚠️ המפתח הוא סוד. אין לכתוב אותו בקוד ואין להעלות אותו ל-GitHub. הוא מועבר לאפליקציה רק כמשתנה סביבה.

## התקנה

```bash
git clone https://github.com/<USERNAME>/render-services-app.git
cd render-services-app
npm install
```

אם החבילה `@api/render-api` אינה מותקנת, יש להתקין אותה לפי הפקודה המופיעה בתיעוד של Render ([api-docs.render.com/reference](https://api-docs.render.com/reference)) תחת **List Services**:

```bash
npx api install "@render-api/v1.0#XXXXXXXX"
```

## הרצה מקומית

הגדירי את המפתח כמשתנה סביבה ואז הריצי:

```bash
# Mac / Linux
export RENDER_API_KEY=rnd_xxxxxxxxxxxx
npm start

# Windows PowerShell
$env:RENDER_API_KEY="rnd_xxxxxxxxxxxx"
npm start
```

המשתנה תקף רק בחלון הטרמינל שבו הוגדר.

לאחר ההרצה:

| כתובת | מה מקבלים |
|---|---|
| `http://localhost:3000/` | הדף עם כרטיס לכל שירות |
| `http://localhost:3000/services` | ה-JSON הגולמי מ-Render |

## ה-API של האפליקציה

### `GET /services`

מחזיר מערך JSON של השירותים בחשבון (עד 20 שירותים).

דוגמה לתשובה (מקוצרת):

```json
[
  {
    "cursor": "abc123",
    "service": {
      "id": "srv-xxxxxxxx",
      "name": "render-services-app",
      "type": "web_service",
      "repo": "https://github.com/<USERNAME>/render-services-app",
      "branch": "main",
      "suspended": "not_suspended",
      "serviceDetails": {
        "url": "https://render-services-app.onrender.com",
        "runtime": "node",
        "plan": "free"
      }
    }
  }
]
```

במקרה של כשל מוחזר סטטוס `500` עם הודעת שגיאה, והפרטים המלאים מודפסים בטרמינל של השרת.

## פרסום ב-Render

1. העלי את הפרויקט ל-GitHub (כולל התיקייה `.api`):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/render-services-app.git
   git push -u origin main
   ```

2. ב-Render לחצי **New +** ← **Web Service** וחברי את ה-Repository.
3. הגדרות:

   | שדה | ערך |
   |---|---|
   | Runtime / Language | Node |
   | Branch | `main` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |

4. תחת **Environment Variables** הוסיפי:
   - Key: `RENDER_API_KEY`
   - Value: המפתח שיצרת

5. לחצי **Create Web Service**. בסיום, הכניסי לכתובת שהוקצתה לך (`https://<name>.onrender.com`).

> ב-Free tier השירות "נרדם" אחרי זמן ללא פעילות, והטעינה הראשונה אחרי ההתעוררות יכולה לקחת כחצי דקה.

## בעיות נפוצות

| בעיה | פתרון |
|---|---|
| `500` מ-`/services` | לבדוק את השגיאה בטרמינל של השרת. לרוב `RENDER_API_KEY` לא הוגדר באותו חלון |
| `401 Unauthorized` | המפתח שגוי או חסר |
| `403 Forbidden` | למפתח אין הרשאת קריאה על Services |
| `Cannot find module '@api/render-api'` | להתקין את החבילה, ולוודא שהתיקייה `.api` הועלתה ל-GitHub |
| הכתובת ב-Render לא נטענת | לוודא ש-`index.js` משתמש ב-`process.env.PORT` |

## אבטחה

- המפתח נשמר בשרת בלבד ולא נחשף לדפדפן. הדף קורא ל-`/services` ולא ישירות ל-Render.
- דף הלקוח בונה את התוכן עם `textContent`, כך שנתונים מה-API אינם מוזרקים כקוד.
- מומלץ להשתמש במפתח עם הרשאת קריאה בלבד, ולמחוק אותו כשאין בו צורך.

## טכנולוגיות

Node.js, Express, [Render API](https://api-docs.render.com/reference), HTML/CSS/JavaScript.
