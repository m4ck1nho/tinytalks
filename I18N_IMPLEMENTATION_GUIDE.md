# Russian Language Implementation Guide

## ✅ Completed

### Core System
1. ✅ Created Language Context (`contexts/LanguageContext.tsx`)
2. ✅ Added Language Provider to root layout
3. ✅ Created English translations (`locales/en.json`)
4. ✅ Created Russian translations (`locales/ru.json`)

### Components Updated
1. ✅ **Navbar** - Full translation + Language switcher (РУС/ENG button)
2. ✅ **Hero** - Main headline and CTAs translated

## Language Switcher

The language switcher appears in:
- **Desktop**: Top right of navbar (РУС/ENG button with globe icon)
- **Mobile**: In mobile menu (Русский/English)

Click it to toggle between English and Russian!

## How It Works

### 1. Language Context
All components can access translations using:
```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return <h1>{t('hero.title')}</h1>;
}
```

### 2. Translation Files
Located in `/locales/`:
- `en.json` - English translations
- `ru.json` - Russian translations

### 3. Translation Keys
Access nested translations with dot notation:
```tsx
t('nav.about')          // "About" or "О нас"
t('hero.title')         // "Achieve B1 Level English" or "Достигните уровня B1"
t('pricing.trial.name') // "Trial Lesson" or "Пробный урок"
```

## Testing the Language Switcher

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open the site:**
   - Go to `http://localhost:3002`

3. **Test the language switcher:**
   - Click the "РУС" button in the navbar
   - All translated text should change to Russian
   - The button changes to "ENG"
   - Click "ENG" to switch back to English

4. **Language persistence:**
   - The selected language is saved in localStorage
   - Refreshing the page maintains your language choice

## Remaining Components to Translate

The translation system is ready! To translate remaining components, follow this pattern:

### Example: Updating a Component

**Before:**
```tsx
export default function About() {
  return (
    <div>
      <h2>About TinyTalks</h2>
      <p>Your Path to English Fluency</p>
    </div>
  );
}
```

**After:**
```tsx
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2>{t('about.badge')}</h2>
      <p>{t('about.title')}</p>
    </div>
  );
}
```

### Components That Need Translation

**Public Components:**
- ✅ Navbar (DONE)
- ✅ Hero (DONE)
- ⏳ About
- ⏳ Pricing
- ⏳ Reviews
- ⏳ BlogPreview
- ⏳ Contact
- ⏳ Footer

**Auth Pages:**
- ⏳ `/auth/page.tsx`
- ⏳ `/admin/login/page.tsx`

**Dashboards:**
- ⏳ `/dashboard/page.tsx` (Student)
- ⏳ `/admin/dashboard/page.tsx` (Teacher)

## Adding New Translations

### 1. Add to English file (`locales/en.json`):
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

### 2. Add to Russian file (`locales/ru.json`):
```json
{
  "mySection": {
    "title": "Мой заголовок",
    "description": "Моё описание"
  }
}
```

### 3. Use in component:
```tsx
{t('mySection.title')}
{t('mySection.description')}
```

## Current Status

The language switcher is **fully functional** with:
- ✅ English/Russian toggle working
- ✅ Navbar translated
- ✅ Hero section translated
- ✅ Language persists across page reloads
- ✅ Smooth switching with no page reload

**Next Steps:**
You can now test the language switcher! The Navbar and Hero will change between English and Russian when you click the language button.

To complete the full translation, follow the pattern above to update the remaining components. All translation keys are already defined in the `locales/en.json` and `locales/ru.json` files!

