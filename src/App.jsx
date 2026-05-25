import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  Bed,
  BedDouble,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Flame,
  Globe2,
  Home,
  Image,
  MapPin,
  Menu,
  Mountain,
  PawPrint,
  ParkingCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Trees,
  Utensils,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";
import { sendAdminBookingEmail } from "./lib/emailNotifications";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import DateRangeCalendar from "./components/booking/DateRangeCalendar";
import {
  calculateSimpleBookingPrice,
  formatAmd,
} from "./utils/pricing";
import { businessRules } from "./data/businessRules";
import { experienceCopy, experiences } from "./data/experiences";
import { hasBlockedDateOverlap } from "./utils/dateOverlap";
import { doesRangeOverlapBlockedDates } from "./utils/dateUtils";

const images = {
  hero:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85",
  house:
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=85",
  horses:
    "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&w=1400&q=85",
  jeep:
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
  forest:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85",
  cabin:
    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1400&q=85",
  mountains:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85",
  table:
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=85",
};

const content = {
  en: {
    nav: ["House", "Amenities", "Packages", "Activities", "Gallery", "Book"],
    heroKicker: "Private nature stay in Dilijan",
    heroText:
      "A quiet private house shaped for slow mountain mornings, warm evenings, horse riding, and jeep routes into the highlands.",
    bookNow: "Request dates",
    explore: "Explore experiences",
    stats: ["Guests", "3 bedrooms", "5 beds", "Large parking"],
    aboutTitle: "Private house between comfort and wild air",
    aboutText:
      "The house is made for travelers who want their own peaceful base in nature without giving up the practical comforts of home. Stay together, cook together, warm up after mountain air, and plan the next ride or trail from one relaxed place.",
    propertyOverview: {
      kicker: "Property overview",
      imageCaption: "A private base for quiet stays, shared meals, and mountain days.",
      features: {
        capacity: ["Capacity", "1-9 guests"],
        bedrooms: ["Bedrooms", "3 separate bedrooms"],
        beds: ["Beds", "5 total beds"],
        bathrooms: ["Bathrooms", "1 bathroom"],
        privateHouse: ["Private house", "Entire place is yours"],
        parking: ["Parking", "Large parking area"],
        wifi: ["Wi-Fi", "Free Wi-Fi available"],
        heating: ["Heating", "Heating available"],
        kitchen: ["Kitchen", "Kitchen available"],
        pets: ["Pets", "Pets are not allowed"],
      },
      sleepingTitle: "Sleeping arrangement",
      bedroomLabel: "Bedroom",
      separateRoom: "Separate room",
      bedTypePlaceholder: "Add bed type here",
      totalBeds: "Total beds",
      maximumGuests: "Maximum guests",
      goodToKnowTitle: "Good to know",
      goodToKnow: {
        checkIn: "Check-in",
        checkOut: "Check-out",
        minimumStay: "Minimum stay",
        minimumStayValue: "1 night",
        payment: "Card and cash payment available at the house",
        deposit: "30% deposit required to reserve dates",
        pets: "Pets are not allowed",
      },
    },
    amenitiesTitle: "Everything essential, nothing complicated",
    amenities: [
      ["Wi-Fi", "Reliable connection for planning, work, and sharing the day."],
      ["Heating", "Warm indoor comfort after forest walks and mountain tours."],
      ["Kitchen", "A practical kitchen for breakfast, dinners, and long stays."],
      ["Large parking", "Easy arrival with space for several vehicles."],
      ["Private house", "The home is yours during the stay."],
      ["Pet policy", "Not pet-friendly at this time."],
    ],
    packagesTitle: "Stay and adventure packages",
    packagesText:
      "Simple options for calm weekends, active escapes, and full GreenSpace experiences. Exact pricing can be shared after dates and group size are confirmed.",
    packages: [
      ["House stay", "Private house rental for families, friends, or small groups.", "Best for rest"],
      ["Stay + horse riding", "Combine the house with a guided riding experience in nature.", "Guest favorite"],
      ["Stay + jeep tour", "Add a mountain jeep route for wide views and harder-to-reach places.", "Adventure"],
    ],
    horseTitle: "Horse riding",
    horseText:
      "A grounded, scenic way to feel Dilijan's landscapes up close. Routes can be adapted for beginners and more confident riders.",
    jeepTitle: "Jeep mountain tours",
    jeepText:
      "Ride deeper into the mountains with a local route mindset: panoramic stops, forest roads, fresh air, and a strong sense of place.",
    horseDetails: "View horse riding details",
    jeepDetails: "View jeep tour details",
    galleryTitle: "Gallery",
    reviewsTitle: "Guest impressions",
    reviews: [
      ["Peaceful and private", "The house felt calm, clean, and close to nature. Perfect for our family weekend."],
      ["Great activity mix", "We loved having both a restful stay and mountain adventure options in one place."],
      ["Easy for groups", "The parking, kitchen, and sleeping setup made the trip simple for everyone."],
    ],
    bookingTitle: "Send a booking request",
    bookingText:
      "Choose your dates, guests, and activities. This form sends a request only — your booking is confirmed after availability and deposit details are agreed.",
    form: {
      name: "Name",
      email: "Email or phone",
      dates: "Preferred dates",
      guests: "Guests",
      message: "Message",
      send: "Prepare inquiry",
      note: "No payment is taken on this website.",
      response: "Your inquiry text is ready. Please send it by phone, email, or messaging app to confirm availability.",
    },
    contactTitle: "Contact and location",
    contactText:
      "The house is located in the Dilijan area.",
    map: "Open in Google Maps",
    footer: "Private house stays, horse riding, and jeep mountain tours in Dilijan.",
  },
  hy: {
    nav: ["Տունը", "Հարմարություններ", "Փաթեթներ", "Ակտիվ հանգիստ", "Պատկերասրահ", "Ամրագրում"],
    heroKicker: "Առանձին տուն բնության մեջ` Դիլիջանում",
    heroText:
      "Հանգիստ առանձին տուն` լեռնային առավոտների, ջերմ երեկոների, ձիավարության և ջիպ տուրերի համար։",
    bookNow: "Ուղարկել հարցում",
    explore: "Տեսնել փորձառությունները",
    stats: ["Հյուրեր", "3 ննջասենյակ", "5 մահճակալ", "Մեծ կայանատեղի"],
    aboutTitle: "Առանձին տուն՝ հարմարավետության և լեռնային օդի միջև",
    aboutText:
      "Տունը ստեղծված է նրանց համար, ովքեր ուզում են հանգիստ բնության մեջ և տան հարմարավետություն։ Կարող եք մնալ միասին, պատրաստել խոհանոցում, տաքանալ զբոսանքից հետո և պլանավորել հաջորդ արկածը մեկ հարմար վայրից։",
    propertyOverview: {
      kicker: "Տան ամփոփում",
      imageCaption: "Առանձին հանգիստ վայր՝ միասին մնալու, պատրաստելու և լեռնային օրեր անցկացնելու համար։",
      features: {
        capacity: ["Տարողություն", "1-9 հյուր"],
        bedrooms: ["Ննջասենյակներ", "3 առանձին ննջասենյակ"],
        beds: ["Մահճակալներ", "ընդամենը 5 մահճակալ"],
        bathrooms: ["Լոգասենյակ", "1 լոգասենյակ"],
        privateHouse: ["Առանձին տուն", "Ամբողջ տունը ձերն է"],
        parking: ["Կայանատեղի", "Մեծ կայանատեղի"],
        wifi: ["Wi-Fi", "Անվճար Wi-Fi"],
        heating: ["Ջեռուցում", "Ջեռուցում կա"],
        kitchen: ["Խոհանոց", "Խոհանոց կա"],
        pets: ["Կենդանիներ", "Կենդանիներ չեն թույլատրվում"],
      },
      sleepingTitle: "Քնելու դասավորություն",
      bedroomLabel: "Ննջասենյակ",
      separateRoom: "Առանձին սենյակ",
      bedTypePlaceholder: "Ավելացնել մահճակալի տեսակը այստեղ",
      totalBeds: "Ընդհանուր մահճակալներ",
      maximumGuests: "Առավելագույն հյուրեր",
      goodToKnowTitle: "Պետք է իմանալ",
      goodToKnow: {
        checkIn: "Մուտք",
        checkOut: "Ելք",
        minimumStay: "Նվազագույն մնալ",
        minimumStayValue: "1 գիշեր",
        payment: "Քարտով և կանխիկ վճարումը հասանելի է տանը",
        deposit: "Ամսաթվերը ամրագրելու համար անհրաժեշտ է 30% կանխավճար",
        pets: "Կենդանիներ չեն թույլատրվում",
      },
    },
    amenitiesTitle: "Անհրաժեշտ ամեն ինչ` պարզ ու հարմար",
    amenities: [
      ["Wi-Fi", "Կապ պլանավորման, աշխատանքի և տպավորություններով կիսվելու համար։"],
      ["Ջեռուցում", "Ջերմ միջավայր անտառային զբոսանքներից և լեռնային տուրերից հետո։"],
      ["Խոհանոց", "Հարմար խոհանոց նախաճաշերի, ընթրիքների և երկար մնալու համար։"],
      ["Մեծ կայանատեղի", "Հեշտ ժամանում և տարածք մի քանի մեքենայի համար։"],
      ["Առանձին տուն", "Տունը ձերն է մնալու ընթացքում։"],
      ["Կենդանիներ", "Այս պահին կենդանիներով չի թույլատրվում։"],
    ],
    packagesTitle: "Մնալու և արկածային փաթեթներ",
    packagesText:
      "Պարզ տարբերակներ հանգիստ հանգստի, ակտիվ ուղևորության և ամբողջական GreenSpace փորձառության համար։ Գինը հստակեցվում է ամսաթվերից և հյուրերի քանակից հետո։",
    packages: [
      ["Տան վարձակալություն", "Առանձին տուն ընտանիքի, ընկերների կամ փոքր խմբի համար։", "Հանգստի համար"],
      ["Տուն + ձիավարություն", "Մնալը համադրեք բնության մեջ ուղեկցվող ձիավարության հետ։", "Սիրված տարբերակ"],
      ["Տուն + ջիպ տուր", "Ավելացրեք լեռնային ջիպ երթուղի՝ գեղեցիկ տեսարաններով։", "Արկածային"],
    ],
    horseTitle: "Ձիավարություն",
    horseText:
      "Դիլիջանի բնությունը մոտիկից զգալու գեղեցիկ և հանգիստ ձև։ Երթուղիները կարող են հարմարեցվել սկսնակների և ավելի փորձառու հեծյալների համար։",
    jeepTitle: "Լեռնային ջիպ տուրեր",
    jeepText:
      "Մուտք գործեք լեռների խորքը՝ համայնապատկերային կանգառներով, անտառային ճանապարհներով և իրական տեղական զգացողությամբ։",
    horseDetails: "Տեսնել ձիավարության մանրամասները",
    jeepDetails: "Տեսնել ջիպ տուրի մանրամասները",
    galleryTitle: "Պատկերասրահ",
    reviewsTitle: "Հյուրերի տպավորություններ",
    reviews: [
      ["Հանգիստ և առանձին", "Տունը մաքուր էր, խաղաղ և բնությանը մոտ։ Հիանալի էր ընտանեկան հանգստի համար։"],
      ["Լավ համադրություն", "Հավանեցինք, որ նույն վայրում կա թե հանգիստ, թե լեռնային արկած։"],
      ["Հարմար խմբերի համար", "Կայանատեղին, խոհանոցը և քնելու պայմանները ամեն ինչ հեշտացրին։"],
    ],
    bookingTitle: "Ուղարկել ամրագրման հարցում",
    bookingText:
      "Ընտրեք ամսաթվերը, հյուրերի քանակը և ակտիվությունները։ Ձևը միայն հարցում է. ամրագրումը հաստատվում է հասանելիությունը և կանխավճարի մանրամասները համաձայնեցնելուց հետո։",
    form: {
      name: "Անուն",
      email: "Էլ. փոստ կամ հեռախոս",
      dates: "Նախընտրելի ամսաթվեր",
      guests: "Հյուրեր",
      message: "Հաղորդագրություն",
      send: "Պատրաստել հարցումը",
      note: "Այս կայքում վճարում չի կատարվում։",
      response: "Ձեր հարցման տեքստը պատրաստ է։ Խնդրում ենք ուղարկել այն հեռախոսով, էլ. փոստով կամ հաղորդագրությամբ՝ հասանելիությունը ճշտելու համար։",
    },
    contactTitle: "Կապ և տեղադիրք",
    contactText:
      "Տունը գտնվում է Դիլիջանի տարածքում։",
    map: "Բացել Google Maps-ում",
    footer: "Առանձին տուն, ձիավարություն և լեռնային ջիպ տուրեր Դիլիջանում։",
  },
  ru: {
    nav: ["Дом", "Удобства", "Пакеты", "Активности", "Галерея", "Бронь"],
    heroKicker: "Частный дом на природе в Дилижане",
    heroText:
      "Спокойный частный дом: горные утра, теплые вечера, прогулки на лошадях и джип-туры по красивым маршрутам.",
    bookNow: "Отправить запрос",
    explore: "Смотреть активности",
    stats: ["Гости", "3 спальни", "5 кроватей", "Большая парковка"],
    aboutTitle: "Частный дом между комфортом и горным воздухом",
    aboutText:
      "Дом подходит путешественникам, которым нужна спокойная база на природе и домашний комфорт. Здесь удобно отдыхать вместе, готовить, согреваться после прогулок и планировать новые маршруты.",
    propertyOverview: {
      kicker: "Обзор дома",
      imageCaption: "Частная спокойная база для отдыха, общих ужинов и горных дней.",
      features: {
        capacity: ["Вместимость", "1-9 гостей"],
        bedrooms: ["Спальни", "3 отдельные спальни"],
        beds: ["Кровати", "5 кроватей всего"],
        bathrooms: ["Ванная", "1 ванная"],
        privateHouse: ["Частный дом", "Весь дом в вашем распоряжении"],
        parking: ["Парковка", "Большая парковочная зона"],
        wifi: ["Wi-Fi", "Бесплатный Wi-Fi"],
        heating: ["Отопление", "Есть отопление"],
        kitchen: ["Кухня", "Есть кухня"],
        pets: ["Питомцы", "Питомцы не допускаются"],
      },
      sleepingTitle: "Спальные места",
      bedroomLabel: "Спальня",
      separateRoom: "Отдельная комната",
      bedTypePlaceholder: "Добавить тип кровати здесь",
      totalBeds: "Всего кроватей",
      maximumGuests: "Максимум гостей",
      goodToKnowTitle: "Полезно знать",
      goodToKnow: {
        checkIn: "Заезд",
        checkOut: "Выезд",
        minimumStay: "Минимальный срок",
        minimumStayValue: "1 ночь",
        payment: "Оплата картой и наличными доступна в доме",
        deposit: "Для резерва дат требуется депозит 30%",
        pets: "Питомцы не допускаются",
      },
    },
    amenitiesTitle: "Все важное без лишней сложности",
    amenities: [
      ["Wi-Fi", "Связь для планирования, работы и обмена впечатлениями."],
      ["Отопление", "Теплый дом после лесных прогулок и горных туров."],
      ["Кухня", "Практичная кухня для завтраков, ужинов и долгого проживания."],
      ["Большая парковка", "Удобный заезд и место для нескольких автомобилей."],
      ["Частный дом", "Дом полностью в вашем распоряжении во время проживания."],
      ["Питомцы", "С питомцами пока нельзя."],
    ],
    packagesTitle: "Пакеты проживания и приключений",
    packagesText:
      "Простые варианты для спокойного отдыха, активной поездки и полного опыта GreenSpace. Точная цена уточняется после дат и количества гостей.",
    packages: [
      ["Проживание", "Аренда частного дома для семьи, друзей или небольшой группы.", "Для отдыха"],
      ["Дом + лошади", "Проживание с прогулкой на лошадях на природе.", "Популярно"],
      ["Дом + джип-тур", "Горный маршрут на джипе с видами и труднодоступными местами.", "Приключение"],
    ],
    horseTitle: "Прогулки на лошадях",
    horseText:
      "Спокойный и красивый способ почувствовать природу Дилижана ближе. Маршруты можно адаптировать для новичков и более уверенных всадников.",
    jeepTitle: "Горные джип-туры",
    jeepText:
      "Поездка глубже в горы: панорамные остановки, лесные дороги, свежий воздух и настоящее чувство места.",
    horseDetails: "Подробнее о прогулке на лошадях",
    jeepDetails: "Подробнее о джип-туре",
    galleryTitle: "Галерея",
    reviewsTitle: "Впечатления гостей",
    reviews: [
      ["Тихо и приватно", "Дом был чистым, спокойным и рядом с природой. Отлично для семейных выходных."],
      ["Хороший микс", "Понравилось, что можно и отдохнуть, и добавить горные активности."],
      ["Удобно для группы", "Парковка, кухня и спальные места сделали поездку очень простой."],
    ],
    bookingTitle: "Отправить запрос на бронь",
    bookingText:
      "Выберите даты, гостей и активности. Форма отправляет только запрос — бронь подтверждается после согласования доступности и деталей депозита.",
    form: {
      name: "Имя",
      email: "Email или телефон",
      dates: "Желаемые даты",
      guests: "Гости",
      message: "Сообщение",
      send: "Подготовить запрос",
      note: "Оплата на сайте не принимается.",
      response: "Текст запроса готов. Отправьте его по телефону, email или в мессенджере, чтобы уточнить доступность.",
    },
    contactTitle: "Контакты и локация",
    contactText:
      "Дом находится в районе Дилижана.",
    map: "Открыть в Google Maps",
    footer: "Частный дом, прогулки на лошадях и горные джип-туры в Дилижане.",
  },
};

const bookingCopy = {
  en: {
    sectionLabel: "Booking",
    badges: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      deposit: "30% deposit",
      confirmation: "Manual confirmation",
    },
    rules: {
      title: "Pricing rules",
      house: ["House", "Based on selected nights"],
      horse: ["Horse riding", "/ rider / hour"],
      jeep: ["Jeep tour", "/ car, up to", "people"],
      deposit: ["Deposit", "of total"],
    },
    stayInfo: {
      checkIn: "Check-in 14:00",
      checkOut: "Check-out 12:00",
      oneNight: "1 night: 90,000 AMD",
      multiNight: "2+ nights: 80,000 AMD/night",
    },
    blocks: {
      guest: "Guest information",
      stay: "Stay details",
      activities: "Add experiences",
      contact: "Contact details",
      message: "Message",
    },
    fields: {
      fullName: "Full name",
      phone: "Phone number",
      email: "Email optional",
      checkIn: "Check-in date",
      checkOut: "Check-out date",
      guests: "Number of guests",
      horseRiders: "Number of riders",
      horseHours: "Duration in hours",
      jeepTour: "Jeep tour",
      jeepCars: "Number of jeep cars",
      message: "Message",
    },
    experiences: {
      horse: {
        title: "Horse Riding",
        text: "10,000 AMD per rider per hour",
        add: "Add horse riding",
      },
      jeep: {
        title: "Jeep Mountain Tour",
        text: "60,000 AMD per car, up to 4 people",
        add: "Add jeep tour",
        choose: "Choose how many jeep cars you want to request.",
        tiers: ["1 car fits up to 4 people", "2 cars fit up to 8 people", "3 cars fit up to 9 people"],
      },
    },
    options: {
      yes: "Yes",
      no: "No",
    },
    summary: {
      title: "Live price summary",
      subtitle: "Updated as you choose dates, guests, and activities.",
      nights: "Nights",
      guests: "Guests",
      housePrice: "House price",
      horsePrice: "Horse riding price",
      jeepPrice: "Jeep tour price",
      totalPrice: "Total price",
      deposit: "30% deposit",
      remaining: "Remaining amount",
      details: "Calculation details",
      adminDetails: "Admin calculation details",
      horseSelection: "Horse riding selection",
      jeepCarsSelected: "Jeep cars selected",
    },
    errors: {
      invalidDate: "Check-out date must be after check-in date.",
      selectDates: "Select dates to calculate price.",
      unavailable: "Some dates in this range are unavailable. Please choose different dates.",
      invalidHorse: "Horse riders must be between 1 and the guest count, and duration must be at least 1 hour.",
      invalidJeep: "Please choose at least 1 jeep car.",
    },
    calendar: {
      previousMonth: "Previous month",
      nextMonth: "Next month",
      selectDate: "Select date",
      selectDates: "Select dates",
      checkIn: "Check-in",
      checkOut: "Check-out",
      nights: "Nights",
      checkInTime: "Check-in time",
      checkOutTime: "Check-out time",
      unavailableWarning: "Some dates in this range are unavailable. Please choose different dates.",
      legend: {
        available: "Available",
        selected: "Selected",
        unavailable: "Unavailable",
        today: "Today",
      },
    },
    submit: "Send booking request",
    sending: "Sending...",
    success:
      "Your booking request has been received. No real payment was processed, and this does not confirm the reservation automatically. GreenSpace Dilijan will review availability and contact you.",
    trustNote:
      "No payment is taken now. Requests are reviewed manually and confirmed only after availability and deposit details are agreed.",
  },
  hy: {
    sectionLabel: "Ամրագրում",
    badges: {
      checkIn: "Մուտք",
      checkOut: "Ելք",
      deposit: "30% կանխավճար",
      confirmation: "Ձեռքով հաստատում",
    },
    rules: {
      title: "Գնային կանոններ",
      house: ["Տուն", "Ըստ ընտրված գիշերների"],
      horse: ["Ձիավարություն", "/ հեծյալ / ժամ"],
      jeep: ["Ջիպ տուր", "/ մեքենա, մինչև", "մարդ"],
      deposit: ["Կանխավճար", "ընդհանուր գումարից"],
    },
    stayInfo: {
      checkIn: "Մուտք՝ 14:00",
      checkOut: "Ելք՝ 12:00",
      oneNight: "1 գիշեր՝ 90,000 AMD",
      multiNight: "2+ գիշեր՝ 80,000 AMD/գիշեր",
    },
    blocks: {
      guest: "Հյուրի տվյալներ",
      stay: "Մնալու մանրամասներ",
      activities: "Ավելացնել փորձառություններ",
      contact: "Կապի տվյալներ",
      message: "Հաղորդագրություն",
    },
    fields: {
      fullName: "Անուն ազգանուն",
      phone: "Հեռախոսահամար",
      email: "Էլ. փոստ՝ ոչ պարտադիր",
      checkIn: "Մուտքի ամսաթիվ",
      checkOut: "Ելքի ամսաթիվ",
      guests: "Հյուրերի քանակ",
      horseRiders: "Հեծյալների քանակ",
      horseHours: "Տևողությունը ժամերով",
      jeepTour: "Ջիպ տուր",
      jeepCars: "Ջիպ մեքենաների քանակ",
      message: "Հաղորդագրություն",
    },
    experiences: {
      horse: {
        title: "Ձիավարություն",
        text: "10,000 AMD մեկ հեծյալի մեկ ժամի համար",
        add: "Ավելացնել ձիավարություն",
      },
      jeep: {
        title: "Լեռնային ջիպ տուր",
        text: "60,000 AMD մեկ մեքենայի համար, մինչև 4 մարդ",
        add: "Ավելացնել ջիպ տուր",
        choose: "Ընտրեք, թե քանի ջիպ մեքենա եք ուզում հարցման մեջ նշել։",
        tiers: ["1 մեքենա՝ մինչև 4 մարդ", "2 մեքենա՝ մինչև 8 մարդ", "3 մեքենա՝ մինչև 9 մարդ"],
      },
    },
    options: {
      yes: "Այո",
      no: "Ոչ",
    },
    summary: {
      title: "Գնի ամփոփում",
      subtitle: "Թարմացվում է ամսաթվերը, հյուրերը և ակտիվությունները ընտրելիս։",
      nights: "Գիշերներ",
      guests: "Հյուրեր",
      housePrice: "Տան արժեք",
      horsePrice: "Ձիավարության արժեք",
      jeepPrice: "Ջիպ տուրի արժեք",
      totalPrice: "Ընդհանուր արժեք",
      deposit: "30% կանխավճար",
      remaining: "Մնացորդ",
      details: "Հաշվարկի մանրամասներ",
      adminDetails: "Ադմին հաշվարկի մանրամասներ",
      horseSelection: "Ձիավարության ընտրություն",
      jeepCarsSelected: "Ընտրված ջիպեր",
    },
    errors: {
      invalidDate: "Ելքի ամսաթիվը պետք է լինի մուտքի ամսաթվից հետո։",
      selectDates: "Ընտրեք ամսաթվերը՝ գինը հաշվարկելու համար։",
      unavailable: "Այս միջակայքի որոշ ամսաթվեր հասանելի չեն։ Խնդրում ենք ընտրել այլ ամսաթվեր։",
      invalidHorse: "Հեծյալների քանակը պետք է լինի 1-ից մինչև հյուրերի քանակը, իսկ տևողությունը՝ առնվազն 1 ժամ։",
      invalidJeep: "Խնդրում ենք ընտրել առնվազն 1 ջիպ մեքենա։",
    },
    calendar: {
      previousMonth: "Նախորդ ամիս",
      nextMonth: "Հաջորդ ամիս",
      selectDate: "Ընտրեք ամսաթիվ",
      selectDates: "Ընտրեք ամսաթվերը",
      checkIn: "Մուտք",
      checkOut: "Ելք",
      nights: "Գիշերներ",
      checkInTime: "Մուտքի ժամ",
      checkOutTime: "Ելքի ժամ",
      unavailableWarning: "Այս միջակայքի որոշ ամսաթվեր հասանելի չեն։ Խնդրում ենք ընտրել այլ ամսաթվեր։",
      legend: {
        available: "Հասանելի",
        selected: "Ընտրված",
        unavailable: "Անհասանելի",
        today: "Այսօր",
      },
    },
    submit: "Ուղարկել ամրագրման հարցում",
    sending: "Ուղարկվում է...",
    success:
      "Ձեր ամրագրման հարցումը ստացվել է։ Իրական վճարում չի կատարվել, և սա ավտոմատ հաստատված ամրագրում չէ։ GreenSpace Dilijan-ը կստուգի հասանելիությունը և կապ կհաստատի ձեզ հետ։",
    trustNote:
      "Այժմ վճարում չի կատարվում։ Հարցումները ստուգվում են ձեռքով և հաստատվում են միայն հասանելիությունը ու կանխավճարի մանրամասները համաձայնեցնելուց հետո։",
  },
  ru: {
    sectionLabel: "Бронь",
    badges: {
      checkIn: "Заезд",
      checkOut: "Выезд",
      deposit: "30% депозит",
      confirmation: "Ручное подтверждение",
    },
    rules: {
      title: "Правила расчета",
      house: ["Дом", "По выбранным ночам"],
      horse: ["Прогулка на лошадях", "/ всадник / час"],
      jeep: ["Джип-тур", "/ машина, до", "человек"],
      deposit: ["Депозит", "от общей суммы"],
    },
    stayInfo: {
      checkIn: "Заезд 14:00",
      checkOut: "Выезд 12:00",
      oneNight: "1 ночь: 90,000 AMD",
      multiNight: "2+ ночи: 80,000 AMD/ночь",
    },
    blocks: {
      guest: "Данные гостя",
      stay: "Детали проживания",
      activities: "Добавить впечатления",
      contact: "Контактные данные",
      message: "Сообщение",
    },
    fields: {
      fullName: "Полное имя",
      phone: "Номер телефона",
      email: "Email необязательно",
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      guests: "Количество гостей",
      horseRiders: "Количество всадников",
      horseHours: "Длительность в часах",
      jeepTour: "Джип-тур",
      jeepCars: "Количество джипов",
      message: "Сообщение",
    },
    experiences: {
      horse: {
        title: "Прогулка на лошадях",
        text: "10,000 AMD за всадника в час",
        add: "Добавить прогулку",
      },
      jeep: {
        title: "Горный джип-тур",
        text: "60,000 AMD за машину, до 4 человек",
        add: "Добавить джип-тур",
        choose: "Выберите, сколько джипов хотите запросить.",
        tiers: ["1 машина до 4 человек", "2 машины до 8 человек", "3 машины до 9 человек"],
      },
    },
    options: {
      yes: "Да",
      no: "Нет",
    },
    summary: {
      title: "Расчет цены",
      subtitle: "Обновляется при выборе дат, гостей и активностей.",
      nights: "Ночи",
      guests: "Гости",
      housePrice: "Стоимость дома",
      horsePrice: "Стоимость прогулки",
      jeepPrice: "Стоимость джип-тура",
      totalPrice: "Итоговая цена",
      deposit: "30% депозит",
      remaining: "Остаток",
      details: "Детали расчета",
      adminDetails: "Технические детали расчета",
      horseSelection: "Выбор прогулки",
      jeepCarsSelected: "Выбранные джипы",
    },
    errors: {
      invalidDate: "Дата выезда должна быть позже даты заезда.",
      selectDates: "Выберите даты, чтобы рассчитать цену.",
      unavailable: "Некоторые даты в этом диапазоне недоступны. Пожалуйста, выберите другие даты.",
      invalidHorse: "Количество всадников должно быть от 1 до числа гостей, а длительность — минимум 1 час.",
      invalidJeep: "Выберите минимум 1 джип.",
    },
    calendar: {
      previousMonth: "Предыдущий месяц",
      nextMonth: "Следующий месяц",
      selectDate: "Выберите дату",
      selectDates: "Выберите даты",
      checkIn: "Заезд",
      checkOut: "Выезд",
      nights: "Ночи",
      checkInTime: "Время заезда",
      checkOutTime: "Время выезда",
      unavailableWarning: "Некоторые даты в этом диапазоне недоступны. Пожалуйста, выберите другие даты.",
      legend: {
        available: "Доступно",
        selected: "Выбрано",
        unavailable: "Недоступно",
        today: "Сегодня",
      },
    },
    submit: "Отправить запрос на бронь",
    sending: "Отправляем...",
    success:
      "Ваш запрос на бронь получен. Реальная оплата не была проведена, и это не автоматическое подтверждение брони. GreenSpace Dilijan проверит доступность и свяжется с вами.",
    trustNote:
      "Оплата сейчас не принимается. Запросы проверяются вручную и подтверждаются только после согласования доступности и деталей депозита.",
  },
};

const amenityIcons = [Wifi, Flame, Utensils, ParkingCircle, Home, ShieldCheck];
const propertyFeatureIcons = {
  capacity: Users,
  bedrooms: BedDouble,
  beds: Bed,
  bathrooms: Bath,
  privateHouse: Home,
  parking: Car,
  wifi: Wifi,
  heating: Flame,
  kitchen: Utensils,
  pets: PawPrint,
};
const primaryPropertyFeatureIds = ["capacity", "bedrooms", "beds", "bathrooms"];
const goodToKnowIcons = {
  checkIn: Clock,
  checkOut: Clock,
  minimumStay: CalendarDays,
  payment: CreditCard,
  deposit: ShieldCheck,
  pets: PawPrint,
};
const gallery = [images.house, images.forest, images.horses, images.jeep, images.cabin, images.table];
const locationCoordinates = businessRules.location.coordinates;
const coordinatesLabel = `${locationCoordinates.latitude}, ${locationCoordinates.longitude}`;
const mapsQuery = `${locationCoordinates.latitude},${locationCoordinates.longitude}`;
const [businessPrimaryName, businessLocationName] = businessRules.businessName.split(" ");
const maxJeepCars = Math.ceil(businessRules.maxGuests / businessRules.jeep.carCapacity);

function getGuestRangeLabel(lang) {
  const guestWords = {
    en: "guests",
    hy: "հյուր",
    ru: "гостей",
  };

  return `${businessRules.minGuests}-${businessRules.maxGuests} ${guestWords[lang] ?? guestWords.en}`;
}

function App() {
  const location = useLocation();
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [publicBlockedDates, setPublicBlockedDates] = useState([]);
  const [booking, setBooking] = useState({
    fullName: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guestCount: 2,
    horseRiding: false,
    horseRiders: 2,
    horseHours: 1,
    jeepTour: false,
    jeepCars: 1,
    message: "",
  });
  const t = content[lang] ?? content.en;
  const bookingUi = bookingCopy[lang] ?? bookingCopy.en;
  const guestRangeLabel = getGuestRangeLabel(lang);
  const stats = [guestRangeLabel, ...t.stats.slice(1)];
  const propertyOverview = businessRules.propertyOverview;
  const propertyFeatures = [
    { id: "capacity" },
    { id: "bedrooms" },
    { id: "beds" },
    { id: "bathrooms" },
    ...propertyOverview.amenities,
  ];
  const goodToKnowItems = [
    { id: "checkIn", value: businessRules.checkInTime },
    { id: "checkOut", value: businessRules.checkOutTime },
    { id: "minimumStay", value: t.propertyOverview.goodToKnow.minimumStayValue },
    { id: "payment", value: t.propertyOverview.goodToKnow.payment },
    { id: "deposit", value: t.propertyOverview.goodToKnow.deposit },
    { id: "pets", value: t.propertyOverview.goodToKnow.pets, disabled: true },
  ];
  const price = useMemo(() => calculateSimpleBookingPrice(booking), [booking]);
  const canCalculateDates = Boolean(booking.checkIn && booking.checkOut);
  const isDateRangeUnavailable = doesRangeOverlapBlockedDates(booking.checkIn, booking.checkOut, publicBlockedDates);
  const isGuestCountValid =
    Number.isFinite(Number(booking.guestCount)) &&
    Number(booking.guestCount) >= businessRules.minGuests &&
    Number(booking.guestCount) <= businessRules.maxGuests;
  const isHorseSelectionValid =
    !booking.horseRiding ||
    (
      Number(booking.horseRiders) >= 1 &&
      Number(booking.horseRiders) <= Number(booking.guestCount) &&
      Number(booking.horseHours) >= 1
    );
  const isJeepSelectionValid = !booking.jeepTour || (Number(booking.jeepCars) >= 1 && Number(booking.jeepCars) <= maxJeepCars);
  const canSubmit = Boolean(
    price.isReady &&
    !price.isDateRangeInvalid &&
    !isDateRangeUnavailable &&
    isGuestCountValid &&
    isHorseSelectionValid &&
    isJeepSelectionValid &&
    booking.fullName.trim() &&
    booking.phone.trim(),
  );
  const housePriceDisplay = price.housePrice > 0 ? formatAmd(price.housePrice) : "-";
  const priceNotice = price.isDateRangeInvalid
    ? bookingUi.errors.invalidDate
    : isDateRangeUnavailable
      ? bookingUi.errors.unavailable
      : !isHorseSelectionValid
        ? bookingUi.errors.invalidHorse
        : !isJeepSelectionValid
          ? bookingUi.errors.invalidJeep
          : !canCalculateDates
            ? bookingUi.errors.selectDates
            : null;
  const homePrefix = location.pathname === "/" ? "" : "/";
  const bookingHref = `${homePrefix}#booking`;

  const navLinks = useMemo(
    () => [
      [`${homePrefix}#house`, t.nav[0]],
      [`${homePrefix}#amenities`, t.nav[1]],
      [`${homePrefix}#packages`, t.nav[2]],
      [`${homePrefix}#activities`, t.nav[3]],
      [`${homePrefix}#gallery`, t.nav[4]],
      [bookingHref, t.nav[5]],
    ],
    [bookingHref, homePrefix, t],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    async function loadBlockedDates() {
      const { data, error } = await supabase
        .from("blocked_dates")
        .select("check_in, check_out")
        .order("check_in", { ascending: true });

      if (error || !isMounted) return;

      setPublicBlockedDates(data ?? []);
    }

    loadBlockedDates();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const activity = new URLSearchParams(location.search).get("activity");

    if (activity === "horse") {
      setBooking((current) => ({
        ...current,
        horseRiding: true,
        horseRiders: Math.min(Number(current.guestCount) || businessRules.minGuests, 2),
        horseHours: Math.max(Number(current.horseHours) || 1, 1),
      }));
    }

    if (activity === "jeep") {
      setBooking((current) => ({
        ...current,
        jeepTour: true,
        jeepCars: Math.min(Math.max(Number(current.jeepCars) || 1, 1), maxJeepCars),
      }));
    }
  }, [location.search]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash, location.pathname]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit || formSubmitting) return;

    setBookingError("");
    setFormSent(false);

    if (!isSupabaseConfigured) {
      setBookingError("Booking requests are not configured yet. Please add Supabase environment variables.");
      return;
    }

    setFormSubmitting(true);

    const { data: blockedDates, error: blockedDatesError } = await supabase
      .from("blocked_dates")
      .select("check_in, check_out");

    if (blockedDatesError) {
      setBookingError(blockedDatesError.message);
      setFormSubmitting(false);
      return;
    }

    if (hasBlockedDateOverlap(booking.checkIn, booking.checkOut, blockedDates ?? [])) {
      setBookingError("These dates are not available. Please choose different dates.");
      setFormSubmitting(false);
      return;
    }

    const bookingRequest = {
      full_name: booking.fullName,
      phone: booking.phone,
      email: booking.email || null,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      guests: booking.guestCount,
      package_type: "custom",
      horse_slots: booking.horseRiding ? Number(booking.horseRiders) * Number(booking.horseHours) : 0,
      jeep_tour: booking.jeepTour,
      jeep_cars: price.jeepCars,
      total_price: price.total,
      deposit_amount: price.deposit,
      remaining_amount: price.remaining,
      message: buildBookingMessage(booking, price),
      status: "pending",
    };

    const { data: createdBooking, error: insertError } = await supabase
      .from("booking_requests")
      .insert(bookingRequest)
      .select()
      .single();

    if (insertError) {
      setBookingError(insertError.message);
      setFormSubmitting(false);
      return;
    }

    await sendAdminBookingEmail(createdBooking);
    setFormSent(true);
    setFormSubmitting(false);
  }

  function updateBooking(field, value) {
    setFormSent(false);
    setBookingError("");
    setBooking((current) => {
      if (field === "guestCount") {
        const guestCount = Math.min(Math.max(Number(value) || businessRules.minGuests, businessRules.minGuests), businessRules.maxGuests);
        const defaultRiders = Math.min(guestCount, 2);

        return {
          ...current,
          guestCount,
          horseRiders: current.horseRiding
            ? Math.min(Math.max(Number(current.horseRiders) || 1, 1), guestCount)
            : defaultRiders,
        };
      }

      if (field === "horseRiding") {
        const guestCount = Number(current.guestCount) || businessRules.minGuests;
        const defaultRiders = Math.min(guestCount, 2);

        return {
          ...current,
          horseRiding: value,
          horseRiders: value ? Math.min(Math.max(Number(current.horseRiders) || defaultRiders, 1), guestCount) : defaultRiders,
          horseHours: value ? Math.max(Number(current.horseHours) || 1, 1) : 1,
        };
      }

      if (field === "horseRiders") {
        const guestCount = Number(current.guestCount) || businessRules.minGuests;

        return {
          ...current,
          horseRiders: Math.min(Math.max(Number(value) || 1, 1), guestCount),
        };
      }

      if (field === "horseHours") {
        return {
          ...current,
          horseHours: Math.max(Number(value) || 1, 1),
        };
      }

      if (field === "jeepTour") {
        return {
          ...current,
          jeepTour: value,
          jeepCars: value ? Math.min(Math.max(Number(current.jeepCars) || 1, 1), maxJeepCars) : 1,
        };
      }

      if (field === "jeepCars") {
        return {
          ...current,
          jeepCars: Math.min(Math.max(Number(value) || 1, 1), maxJeepCars),
        };
      }

      return { ...current, [field]: value };
    });
  }

  if (location.pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={(
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          )}
        />
        <Route
          path="/admin/bookings"
          element={(
            <ProtectedAdminRoute>
              <AdminBookings />
            </ProtectedAdminRoute>
          )}
        />
        <Route
          path="/admin/calendar"
          element={(
            <ProtectedAdminRoute>
              <AdminCalendar />
            </ProtectedAdminRoute>
          )}
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-forest-900/85 text-white backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label={`${businessRules.businessName} home`}>
            <span className="flex size-10 items-center justify-center rounded-full bg-forest-100 text-forest-900">
              <Trees size={22} />
            </span>
            <span>
              <span className="block text-base font-semibold leading-tight">{businessPrimaryName}</span>
              <span className="block text-xs uppercase tracking-[0.22em] text-forest-100">{businessLocationName}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-white/80 transition hover:text-white">
                {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher lang={lang} setLang={setLang} />
            <a
              href={bookingHref}
              className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-forest-900 transition hover:bg-white"
            >
              <CalendarDays size={17} />
              {t.bookNow}
            </a>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 bg-forest-900 px-4 pb-5 pt-2 lg:hidden">
            <div className="grid gap-2">
              {navLinks.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-md px-2 py-2 text-sm text-white/85"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-3">
              <LanguageSwitcher lang={lang} setLang={setLang} />
            </div>
          </div>
        )}
      </header>

      <Routes>
        <Route
          path="/"
          element={(
      <main>
        <section className="relative flex min-h-[92vh] items-end overflow-hidden pt-24">
          <img src={images.hero} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/55 to-forest-900/10" />
          <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm backdrop-blur-md">
                <MapPin size={17} />
                {t.heroKicker}
              </p>
              <h1 className="font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
                {businessRules.businessName}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">{t.heroText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 font-semibold text-forest-900 transition hover:bg-white"
                >
                  <CalendarDays size={19} />
                  {t.bookNow}
                </a>
                <a
                  href="#activities"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 font-semibold text-white transition hover:bg-white/12"
                >
                  {t.explore}
                  <ChevronRight size={19} />
                </a>
              </div>
            </div>

            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat} className="rounded-md border border-white/16 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white">{stat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="house" className="bg-forest-50/70 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div>
                <SectionKicker icon={Home} label={t.propertyOverview.kicker} />
                <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">
                  {t.aboutTitle}
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/75">{t.aboutText}</p>

                <div className="mt-8 overflow-hidden rounded-md bg-white shadow-soft">
                  <div className="relative aspect-[4/3] min-h-[300px]">
                    <img src={images.house} alt="Private vacation house surrounded by nature" className="absolute inset-0 size-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/78 via-forest-900/12 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <p className="max-w-sm text-sm font-semibold leading-6 text-white/90">{t.propertyOverview.imageCaption}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-forest-900/10 sm:grid-cols-4">
                    {primaryPropertyFeatureIds.map((featureId) => {
                      const [label, value] = t.propertyOverview.features[featureId];
                      const displayValue = featureId === "capacity" ? guestRangeLabel : value;
                      const Icon = propertyFeatureIcons[featureId];
                      return (
                        <div key={featureId} className="bg-white p-4">
                          <Icon size={19} className="text-clay" aria-hidden="true" />
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</p>
                          <p className="mt-1 text-sm font-semibold text-forest-900">{displayValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {propertyFeatures.map((feature) => {
                  const [label, value] = t.propertyOverview.features[feature.id];
                  const displayValue = feature.id === "capacity" ? guestRangeLabel : value;
                  const Icon = propertyFeatureIcons[feature.id];
                  const disabled = feature.available === false;

                  return (
                    <PropertyFeatureCard
                      key={feature.id}
                      icon={Icon}
                      label={label}
                      value={displayValue}
                      disabled={disabled}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <h3 className="font-serif text-3xl leading-tight text-forest-900">{t.propertyOverview.sleepingTitle}</h3>
                  <div className="flex flex-wrap gap-2">
                    <InfoBadge icon={Bed} text={`${t.propertyOverview.totalBeds}: ${propertyOverview.beds}`} />
                    <InfoBadge icon={Users} text={`${t.propertyOverview.maximumGuests}: ${businessRules.maxGuests}`} />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {propertyOverview.sleepingArrangement.map((room, index) => (
                    <article key={room.id} className="rounded-md border border-forest-900/10 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                          <BedDouble size={21} aria-hidden="true" />
                        </span>
                        <div>
                          <h4 className="text-lg font-semibold text-forest-900">
                            {t.propertyOverview.bedroomLabel} {index + 1}
                          </h4>
                          <p className="mt-1 text-sm font-semibold text-ink/55">{t.propertyOverview.separateRoom}</p>
                        </div>
                      </div>
                      <p className="mt-5 rounded-md border border-dashed border-forest-900/18 bg-forest-50 px-4 py-3 text-sm font-semibold text-ink/62">
                        {t.propertyOverview.bedTypePlaceholder}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-forest-900/10 bg-white p-5 shadow-sm">
                <h3 className="font-serif text-3xl leading-tight text-forest-900">{t.propertyOverview.goodToKnowTitle}</h3>
                <div className="mt-5 grid gap-3">
                  {goodToKnowItems.map((item) => {
                    const Icon = goodToKnowIcons[item.id];
                    const label = t.propertyOverview.goodToKnow[item.id];
                    const hasCompactLabel = item.id === "checkIn" || item.id === "checkOut" || item.id === "minimumStay";

                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 rounded-md border px-4 py-3 ${
                          item.disabled
                            ? "border-forest-900/10 bg-cream/70 text-ink/58"
                            : "border-forest-900/10 bg-forest-50/70 text-forest-900"
                        }`}
                      >
                        <Icon size={19} className={`mt-0.5 shrink-0 ${item.disabled ? "text-ink/35" : "text-clay"}`} aria-hidden="true" />
                        <p className="text-sm font-semibold leading-6">
                          {hasCompactLabel ? `${label}: ${item.value}` : item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="amenities" className="bg-forest-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionKicker icon={Sparkles} label="Comfort" light />
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">{t.amenitiesTitle}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.amenities.map(([title, description], index) => {
                const Icon = amenityIcons[index];
                return (
                  <div key={title} className="rounded-md border border-white/10 bg-white/[0.06] p-6">
                    <Icon className="text-forest-100" size={28} />
                    <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                    <p className="mt-3 leading-7 text-white/72">{description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="packages" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <SectionKicker icon={ShieldCheck} label="Packages" />
              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">{t.packagesTitle}</h2>
            </div>
            <p className="text-lg leading-8 text-ink/72">{t.packagesText}</p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {t.packages.map(([title, description, tag]) => (
              <article key={title} className="rounded-md border border-forest-900/10 bg-white p-6 shadow-sm">
                <span className="inline-flex rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-700">
                  {tag}
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-forest-900">{title}</h3>
                <p className="mt-3 leading-7 text-ink/70">{description}</p>
                <a href="#booking" className="mt-6 inline-flex items-center gap-2 font-semibold text-clay">
                  {t.bookNow}
                  <ChevronRight size={18} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="activities" className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Activity
              image={images.horses}
              icon={Trees}
              title={t.horseTitle}
              text={t.horseText}
              to="/horse-riding"
              buttonLabel={t.horseDetails}
            />
            <Activity
              image={images.jeep}
              icon={Mountain}
              title={t.jeepTitle}
              text={t.jeepText}
              to="/jeep-tour"
              buttonLabel={t.jeepDetails}
            />
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionKicker icon={Globe2} label="Dilijan" />
          <h2 className="mt-4 font-serif text-4xl text-forest-900 sm:text-5xl">{t.galleryTitle}</h2>
          <div className="mt-10 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((src, index) => (
              <div key={src} className={`overflow-hidden rounded-md ${index === 0 || index === 3 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
                <img src={src} alt="" className="size-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-forest-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionKicker icon={Check} label="Reviews" />
            <h2 className="mt-4 font-serif text-4xl text-forest-900 sm:text-5xl">{t.reviewsTitle}</h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {t.reviews.map(([title, quote]) => (
                <article key={title} className="rounded-md bg-white p-6 shadow-sm">
                  <div className="flex gap-1 text-clay" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-forest-900">{title}</h3>
                  <p className="mt-3 leading-7 text-ink/70">{quote}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="booking" className="bg-forest-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <SectionKicker icon={Send} label={bookingUi.sectionLabel} />
              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">{t.bookingTitle}</h2>
              <p className="mt-6 text-lg leading-8 text-ink/72">{t.bookingText}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <InfoBadge icon={CalendarDays} text={`${bookingUi.badges.checkIn} ${businessRules.checkInTime}`} />
                <InfoBadge icon={CalendarDays} text={`${bookingUi.badges.checkOut} ${businessRules.checkOutTime}`} />
                <InfoBadge icon={ShieldCheck} text={bookingUi.badges.deposit} />
                <InfoBadge icon={Check} text={bookingUi.badges.confirmation} />
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
              <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-forest-900/10 bg-white p-5 shadow-soft sm:p-8"
              >
                <div className="space-y-8">
                  <FormBlock title={bookingUi.blocks.stay}>
                    <div className="sm:col-span-2">
                      <DateRangeCalendar
                        checkIn={booking.checkIn}
                        checkOut={booking.checkOut}
                        onChange={({ checkIn, checkOut }) => {
                          setFormSent(false);
                          setBookingError("");
                          setBooking((current) => ({ ...current, checkIn, checkOut }));
                        }}
                        blockedDates={publicBlockedDates}
                        minDate={new Date()}
                        locale={lang}
                        copy={bookingUi.calendar}
                      />
                    </div>
                    <Field
                      label={bookingUi.fields.guests}
                      name="guestCount"
                      type="number"
                      min={businessRules.minGuests}
                      max={businessRules.maxGuests}
                      value={booking.guestCount}
                      onChange={(event) => updateBooking("guestCount", Number(event.target.value))}
                      required
                    />
                    <StayInfo items={bookingUi.stayInfo} />
                  </FormBlock>

                  <FormBlock title={bookingUi.blocks.activities}>
                    <ExperienceToggleCard
                      icon={Trees}
                      title={bookingUi.experiences.horse.title}
                      text={bookingUi.experiences.horse.text}
                      label={bookingUi.experiences.horse.add}
                      checked={booking.horseRiding}
                      onChange={(checked) => updateBooking("horseRiding", checked)}
                    />
                    {booking.horseRiding && (
                      <div className="grid gap-4 rounded-md border border-forest-900/10 bg-forest-50/70 p-4 sm:col-span-2 sm:grid-cols-2">
                        <Field
                          label={bookingUi.fields.horseRiders}
                          name="horseRiders"
                          type="number"
                          min="1"
                          max={booking.guestCount}
                          value={booking.horseRiders}
                          onChange={(event) => updateBooking("horseRiders", Number(event.target.value))}
                          required
                        />
                        <Field
                          label={bookingUi.fields.horseHours}
                          name="horseHours"
                          type="number"
                          min="1"
                          value={booking.horseHours}
                          onChange={(event) => updateBooking("horseHours", Number(event.target.value))}
                          required
                        />
                      </div>
                    )}

                    <ExperienceToggleCard
                      icon={Car}
                      title={bookingUi.experiences.jeep.title}
                      text={bookingUi.experiences.jeep.text}
                      label={bookingUi.experiences.jeep.add}
                      checked={booking.jeepTour}
                      onChange={(checked) => updateBooking("jeepTour", checked)}
                    />
                    {booking.jeepTour && (
                      <div className="rounded-md border border-forest-900/10 bg-forest-50/70 p-4 sm:col-span-2">
                        <p className="text-sm font-semibold text-forest-900">{bookingUi.experiences.jeep.choose}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {bookingUi.experiences.jeep.tiers.map((tier) => (
                            <span key={tier} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink/70">
                              {tier}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 max-w-xs">
                          <Field
                            label={bookingUi.fields.jeepCars}
                            name="jeepCars"
                            type="number"
                            min="1"
                            max={maxJeepCars}
                            value={booking.jeepCars}
                            onChange={(event) => updateBooking("jeepCars", Number(event.target.value))}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </FormBlock>

                  <FormBlock title={bookingUi.blocks.contact}>
                    <Field
                      label={bookingUi.fields.fullName}
                      name="fullName"
                      value={booking.fullName}
                      onChange={(event) => updateBooking("fullName", event.target.value)}
                      required
                    />
                    <Field
                      label={bookingUi.fields.phone}
                      name="phone"
                      type="tel"
                      value={booking.phone}
                      onChange={(event) => updateBooking("phone", event.target.value)}
                      required
                    />
                    <Field
                      label={bookingUi.fields.email}
                      name="email"
                      type="email"
                      value={booking.email}
                      onChange={(event) => updateBooking("email", event.target.value)}
                    />
                  </FormBlock>

                  <FormBlock title={bookingUi.blocks.message} columns={false}>
                    <label className="block">
                      <span className="text-sm font-semibold text-forest-900">{bookingUi.fields.message}</span>
                      <textarea
                        name="message"
                        rows="5"
                        value={booking.message}
                        onChange={(event) => updateBooking("message", event.target.value)}
                        className="mt-2 w-full rounded-md border border-forest-900/15 bg-cream/50 px-4 py-3 outline-none transition focus:border-forest-500 focus:bg-white"
                      />
                    </label>
                  </FormBlock>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || formSubmitting}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3 font-semibold text-white transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:bg-forest-300 sm:w-auto"
                >
                  <Send size={18} />
                  {formSubmitting ? bookingUi.sending : bookingUi.submit}
                </button>
                {bookingError && (
                  <p
                    className="mt-5 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800"
                    role="alert"
                  >
                    {bookingError}
                  </p>
                )}
                {formSent && (
                  <p
                    className="mt-5 rounded-md border border-forest-300 bg-forest-50 p-4 text-sm leading-6 text-forest-900"
                    role="status"
                  >
                    {bookingUi.success}
                  </p>
                )}
                <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/62">{bookingUi.trustNote}</p>
              </form>

              <aside className="lg:sticky lg:top-28">
                <div className="rounded-lg border border-forest-900/10 bg-white p-5 shadow-soft sm:p-6">
                  <div className="border-b border-forest-900/10 pb-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">{bookingUi.summary.title}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/60">{bookingUi.summary.subtitle}</p>
                    {priceNotice && (
                      <PriceNotice
                        message={priceNotice}
                        warning={price.isDateRangeInvalid}
                      />
                    )}
                  </div>

                  <div className="divide-y divide-forest-900/10">
                    <SummaryRow label={bookingUi.summary.nights} value={price.nights > 0 ? `${price.nights}` : "-"} />
                    <SummaryRow label={bookingUi.summary.guests} value={`${booking.guestCount}`} />
                    <SummaryRow label={bookingUi.summary.housePrice} value={housePriceDisplay} />
                    {booking.horseRiding && (
                      <SummaryRow label={bookingUi.summary.horsePrice} value={formatAmd(price.horsePrice)} />
                    )}
                    {booking.jeepTour && (
                      <SummaryRow label={bookingUi.summary.jeepPrice} value={formatCountWithPrice(price.jeepCars, price.jeepPrice)} />
                    )}
                  </div>

                  <div className="mt-6 rounded-md bg-forest-900 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-100">
                      {bookingUi.summary.totalPrice}
                    </p>
                    <p className="mt-2 text-3xl font-semibold leading-tight">
                      {price.isReady ? formatAmd(price.total) : "-"}
                    </p>
                  </div>

                  <div className="mt-3 rounded-md border border-clay/25 bg-clay/10 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-semibold text-clay">{bookingUi.summary.deposit}</span>
                      <span className="text-right text-lg font-semibold text-forest-900">
                        {price.isReady ? formatAmd(price.deposit) : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-4 rounded-md bg-forest-50 px-4 py-3">
                    <span className="text-sm font-semibold text-ink/58">{bookingUi.summary.remaining}</span>
                    <span className="text-right font-semibold text-forest-900">
                      {price.isReady ? formatAmd(price.remaining) : "-"}
                    </span>
                  </div>

                  <details className="group mt-5 border-t border-forest-900/10 pt-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-forest-900 [&::-webkit-details-marker]:hidden">
                      <span>{bookingUi.summary.adminDetails}</span>
                      <ChevronRight
                        size={18}
                        className="shrink-0 text-clay transition group-open:rotate-90"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="mt-3 divide-y divide-forest-900/10">
                      <SummaryRow
                        compact
                        label={bookingUi.summary.horseSelection}
                        value={booking.horseRiding ? `${booking.horseRiders} x ${booking.horseHours}` : bookingUi.options.no}
                      />
                      <SummaryRow
                        compact
                        label={bookingUi.summary.jeepCarsSelected}
                        value={booking.jeepTour ? `${price.jeepCars}` : bookingUi.options.no}
                      />
                    </div>
                  </details>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <SectionKicker icon={MapPin} label={coordinatesLabel} />
              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">{t.contactTitle}</h2>
              <p className="mt-6 text-lg leading-8 text-ink/72">{t.contactText}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-5 py-3 font-semibold text-white transition hover:bg-forest-900"
                >
                  <MapPin size={18} />
                  {t.map}
                </a>
                <a
                  href="tel:+37400000000"
                  className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-5 py-3 font-semibold text-forest-900 transition hover:bg-forest-50"
                >
                  <Phone size={18} />
                  +374 00 000000
                </a>
              </div>
            </div>
            <div className="min-h-[360px] overflow-hidden rounded-md border border-forest-900/10 shadow-soft">
              <iframe
                title={`${businessRules.businessName} map`}
                src={`https://maps.google.com/maps?q=${mapsQuery}&z=13&output=embed`}
                className="size-full min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
          )}
        />
        <Route path="/horse-riding" element={<ExperienceDetailPage lang={lang} experienceKey="horseRiding" />} />
        <Route path="/jeep-tour" element={<ExperienceDetailPage lang={lang} experienceKey="jeepTour" />} />
      </Routes>

      <footer className="bg-forest-900 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{businessRules.businessName}</p>
            <p className="mt-1 text-sm text-white/65">{t.footer}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <Car size={17} />
              {coordinatesLabel}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function buildBookingMessage(booking, price) {
  const activityDetails = [
    booking.horseRiding
      ? `Horse riding: ${booking.horseRiders} rider(s), ${booking.horseHours} hour(s), ${formatAmd(price.horsePrice)}`
      : null,
    booking.jeepTour
      ? `Jeep tour: ${price.jeepCars} car(s), ${formatAmd(price.jeepPrice)}`
      : null,
  ].filter(Boolean);
  const customerMessage = booking.message?.trim();

  if (!activityDetails.length) return customerMessage || null;
  if (!customerMessage) return activityDetails.join("\n");

  return `${customerMessage}\n\n${activityDetails.join("\n")}`;
}

function ProtectedAdminRoute({ children }) {
  const [authState, setAuthState] = useState({ loading: true, allowed: false, message: "" });

  useEffect(() => {
    let active = true;

    async function checkAdminAccess() {
      if (!isSupabaseConfigured) {
        if (active) {
          setAuthState({
            loading: false,
            allowed: false,
            message: "Supabase environment variables are missing.",
          });
        }
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        if (active) setAuthState({ loading: false, allowed: false, message: "" });
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc("is_admin");
      if (active) {
        setAuthState({
          loading: false,
          allowed: Boolean(isAdmin && !error),
          message: error ? error.message : "",
        });
      }
    }

    checkAdminAccess();
    const { data: listener } = supabase?.auth.onAuthStateChange(() => {
      checkAdminAccess();
    }) ?? { data: null };

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (authState.loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4 text-slate-700">
        <p className="rounded-md bg-white px-5 py-4 text-sm font-semibold shadow-sm">Checking admin access...</p>
      </main>
    );
  }

  if (!authState.allowed) {
    return <Navigate to="/admin/login" replace state={{ message: authState.message }} />;
  }

  return children;
}

function ExperienceDetailPage({ lang, experienceKey }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const localized = experienceCopy[lang] ?? experienceCopy.en;
  const shared = localized.shared;
  const copy = localized[experienceKey];
  const experience = experiences[experienceKey];
  const isJeepTour = experienceKey === "jeepTour";
  const galleryImages = experience.gallery.map((src, index) => ({
    src,
    fallback: experience.fallbackGallery[index],
  }));

  function goToBooking() {
    navigate(`/?activity=${experience.bookingActivity}#booking`);
  }

  return (
    <main className="bg-cream pt-16 text-ink">
      <section className="relative min-h-[74vh] overflow-hidden">
        <ImageWithFallback
          src={experience.heroImage}
          fallback={experience.fallbackHeroImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/55 to-forest-900/10" />
        <div className="relative mx-auto flex min-h-[74vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
          <Link to="/" className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:bg-white/18">
            <ArrowLeft size={17} />
            {shared.backHome}
          </Link>
          <div className="max-w-3xl">
            <SectionKicker icon={isJeepTour ? Mountain : Trees} label={businessRules.location.name} light />
            <h1 className="mt-5 font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">{copy.subtitle}</p>
            <button
              type="button"
              onClick={goToBooking}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 font-semibold text-forest-900 transition hover:bg-white"
            >
              <CalendarDays size={19} />
              {copy.heroCta}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionKicker icon={isJeepTour ? Car : Trees} label={isJeepTour ? "Adventure" : "Nature"} />
          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">{copy.aboutTitle}</h2>
        </div>
        <div className="grid gap-4">
          <article className="rounded-md border border-forest-900/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-lg leading-8 text-ink/74">{copy.about}</p>
            <p className="mt-5 rounded-md bg-forest-50 p-4 font-semibold leading-7 text-forest-900">
              {isJeepTour ? copy.availabilityNote : copy.priceText}
            </p>
            {!isJeepTour && <p className="mt-4 leading-7 text-ink/66">{copy.beginnerText}</p>}
          </article>
          {isJeepTour && (
            <article className="rounded-md border border-clay/20 bg-clay/10 p-6">
              <p className="font-semibold text-clay">{copy.availabilityNote}</p>
            </article>
          )}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionKicker icon={Check} label={shared.includedTitle} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.included.map((item) => (
              <div key={item} className="rounded-md border border-forest-900/10 bg-cream p-5">
                <Check className="text-clay" size={22} />
                <p className="mt-4 font-semibold text-forest-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isJeepTour && (
        <section className="bg-forest-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionKicker icon={Car} label={shared.pricingTitle} light />
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {copy.pricing.map(([group, price]) => (
                <article key={group} className="rounded-md border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-100">{group}</p>
                  <p className="mt-4 text-2xl font-semibold">{price}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 rounded-md bg-white/10 p-4 font-semibold text-forest-100">{copy.pricingNote}</p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionKicker icon={Image} label={shared.galleryTitle} />
        <div className="mt-10 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden rounded-md bg-forest-50 text-left shadow-sm ${index === 0 || index === 3 ? "lg:col-span-2 lg:row-span-2" : ""}`}
              aria-label={shared.galleryTitle}
            >
              <ImageWithFallback
                src={image.src}
                fallback={image.fallback}
                alt=""
                className="size-full object-cover transition duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      <section className="bg-forest-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionKicker icon={Check} label={shared.reviewsTitle} />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {copy.reviews.map(([title, quote]) => (
              <article key={title} className="rounded-md border border-forest-900/10 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">{shared.placeholderNote}</p>
                <h3 className="mt-5 text-xl font-semibold text-forest-900">{title}</h3>
                <p className="mt-3 leading-7 text-ink/70">{quote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-md bg-forest-900 p-8 text-white shadow-soft sm:p-10">
          <SectionKicker icon={Send} label={businessRules.businessName} light />
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{shared.readyTitle}</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goToBooking}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 font-semibold text-forest-900 transition hover:bg-white"
            >
              <CalendarDays size={19} />
              {copy.cta}
            </button>
            <button
              type="button"
              onClick={goToBooking}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 font-semibold text-white transition hover:bg-white/12"
            >
              <Send size={18} />
              {shared.sendBookingRequest}
            </button>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-900/90 p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
          >
            <X size={22} />
          </button>
          <ImageWithFallback
            src={selectedImage.src}
            fallback={selectedImage.fallback}
            alt=""
            className="max-h-[86vh] w-full max-w-6xl rounded-md object-contain shadow-soft"
          />
        </div>
      )}
    </main>
  );
}

function ImageWithFallback({ src, fallback, alt, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallback;
      }}
      {...props}
    />
  );
}

function LanguageSwitcher({ lang, setLang }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1">
      {businessRules.languages.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            lang === code ? "bg-cream text-forest-900" : "text-white/75 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SectionKicker({ icon: Icon, label, light = false }) {
  return (
    <p className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] ${light ? "text-forest-100" : "text-clay"}`}>
      <Icon size={17} />
      {label}
    </p>
  );
}

function Activity({ image, icon: Icon, title, text, to, buttonLabel }) {
  return (
    <Link to={to} className="group block overflow-hidden rounded-md bg-cream shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="h-72 overflow-hidden">
        <img src={image} alt="" className="size-full object-cover transition duration-500 hover:scale-105" />
      </div>
      <div className="p-6 sm:p-8">
        <Icon className="text-clay" size={30} />
        <h3 className="mt-5 text-3xl font-semibold text-forest-900">{title}</h3>
        <p className="mt-4 leading-8 text-ink/72">{text}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-clay">
          {buttonLabel}
          <ChevronRight size={18} />
        </span>
      </div>
    </Link>
  );
}

function PropertyFeatureCard({ icon: Icon, label, value, disabled = false }) {
  return (
    <article
      className={`rounded-md border p-4 shadow-sm transition hover:-translate-y-0.5 ${
        disabled
          ? "border-forest-900/10 bg-cream/75"
          : "border-forest-900/10 bg-white hover:shadow-soft"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
            disabled ? "bg-ink/10 text-ink/45" : "bg-forest-100 text-forest-700"
          }`}
        >
          <Icon size={21} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</h3>
          <p className={`mt-1 text-base font-semibold leading-6 ${disabled ? "text-ink/58" : "text-forest-900"}`}>
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

function InfoBadge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white px-4 py-2 text-sm font-semibold text-forest-900 shadow-sm">
      <Icon size={16} className="shrink-0 text-clay" aria-hidden="true" />
      {text}
    </span>
  );
}

function StayInfo({ items }) {
  return (
    <div className="grid gap-2 rounded-md border border-forest-900/10 bg-forest-50/70 p-4 sm:col-span-2 sm:grid-cols-2">
      {[items.checkIn, items.checkOut, items.oneNight, items.multiNight].map((item) => (
        <span key={item} className="inline-flex items-center gap-2 text-sm font-semibold text-forest-900">
          <Check size={15} className="shrink-0 text-clay" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );
}

function ExperienceToggleCard({ icon: Icon, title, text, label, checked, onChange }) {
  return (
    <article className={`rounded-md border p-5 transition ${
      checked ? "border-forest-500 bg-forest-50 shadow-sm" : "border-forest-900/10 bg-white"
    }`}>
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <Icon size={21} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-forest-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/68">{text}</p>
        </div>
      </div>
      <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-md bg-white px-4 py-3 text-sm font-semibold text-forest-900 shadow-sm">
        <span>{label}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-5 rounded border-forest-900/20 text-forest-700 accent-forest-700"
        />
      </label>
    </article>
  );
}

function FormBlock({ title, children, columns = true }) {
  return (
    <fieldset className="border-t border-forest-900/10 pt-7 first:border-t-0 first:pt-0">
      <legend className="text-base font-semibold text-forest-900">{title}</legend>
      <div className={`mt-4 grid gap-4 ${columns ? "sm:grid-cols-2" : ""}`}>{children}</div>
    </fieldset>
  );
}

function Field({ label, name, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest-900">{label}</span>
      <input
        name={name}
        type={type}
        className="mt-2 w-full rounded-md border border-forest-900/15 bg-cream/50 px-4 py-3 outline-none transition focus:border-forest-500 focus:bg-white"
        {...props}
      />
    </label>
  );
}

function PriceNotice({ message, warning = false }) {
  return (
    <p
      className={`mt-4 flex items-start gap-2 rounded-md border p-3 text-sm font-semibold leading-5 ${
        warning
          ? "border-clay/30 bg-clay/10 text-clay"
          : "border-forest-900/10 bg-forest-50 text-forest-900"
      }`}
      role={warning ? "alert" : "status"}
    >
      <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function SummaryRow({ label, value, compact = false }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${compact ? "py-2 text-sm" : "py-3 text-sm"}`}>
      <span className="text-ink/62">{label}</span>
      <span className="text-right font-semibold text-forest-900">{value}</span>
    </div>
  );
}

function formatCountWithPrice(count, price) {
  return `${count} (${formatAmd(price)})`;
}

export default App;
