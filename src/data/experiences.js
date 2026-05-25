import { businessRules } from "./businessRules";

const horsePrice = businessRules.horseRidingPrice.amount;
const jeepCarPrice = businessRules.jeep.carPrice;
const jeepCapacity = businessRules.jeep.carCapacity;

export const experienceCopy = {
  en: {
    shared: {
      backHome: "Back to home",
      includedTitle: "What is included",
      galleryTitle: "Gallery",
      reviewsTitle: "Customer reviews",
      pricingTitle: "Pricing guide",
      readyTitle: "Ready to plan your Dilijan stay?",
      sendBookingRequest: "Send booking request",
      placeholderNote: "Placeholder review, replace with a real guest review later.",
    },
    horseRiding: {
      title: "Horse Riding in Dilijan",
      subtitle: "A calm nature experience for guests who want to slow down and feel the landscape up close.",
      heroCta: "Add to booking request",
      aboutTitle: "Flexible riding for your group",
      about:
        "Horse riding is flexible: not every guest has to ride, and your group can choose 1, 2, 3, 4, or more riding slots depending on interest and availability.",
      beginnerText: "Beginner-friendly guidance can be discussed before the booking is confirmed.",
      priceText: `Price: ${horsePrice.toLocaleString("en-US")} AMD per rider per hour.`,
      included: ["1 hour riding", "Nature route", "Photo opportunity", "Flexible number of riders"],
      reviews: [
        ["Placeholder riding review 1", "Use this space for a future guest note about the horse riding pace and nature experience."],
        ["Placeholder riding review 2", "Use this space for a future guest note about beginner comfort or group flexibility."],
        ["Placeholder riding review 3", "Use this space for a future guest note about photos, views, or the guide experience."],
      ],
      cta: "Try horse riding",
    },
    jeepTour: {
      title: "Jeep Mountain Tour in Dilijan",
      subtitle: "An adventurous mountain experience with wide views, scenic stops, and fresh highland air.",
      heroCta: "Add to booking request",
      aboutTitle: "Mountain touring made clear",
      about:
        "One jeep car fits up to 4 people and costs 60,000 AMD. For 5-8 guests, 2 cars are needed. For 9 guests, 3 cars may be needed.",
      availabilityNote: "The exact route and availability are confirmed before booking.",
      included: ["Jeep mountain route", "Driver", "Scenic stops", "Photo opportunities", "Group-friendly experience"],
      pricing: [
        ["1-4 guests", `1 car = ${jeepCarPrice.toLocaleString("en-US")} AMD`],
        ["5-8 guests", `2 cars = ${(jeepCarPrice * 2).toLocaleString("en-US")} AMD`],
        ["9 guests", `3 cars = ${(jeepCarPrice * 3).toLocaleString("en-US")} AMD`],
      ],
      pricingNote: "Best value is for groups of 4 or 8.",
      reviews: [
        ["Placeholder jeep review 1", "Use this space for a future guest note about mountain views and scenic stops."],
        ["Placeholder jeep review 2", "Use this space for a future guest note about comfort for groups or the driver experience."],
        ["Placeholder jeep review 3", "Use this space for a future guest note about the adventure feeling or photo moments."],
      ],
      cta: "Try jeep tour",
    },
  },
  hy: {
    shared: {
      backHome: "Վերադառնալ գլխավոր էջ",
      includedTitle: "Ինչ է ներառված",
      galleryTitle: "Պատկերասրահ",
      reviewsTitle: "Հյուրերի կարծիքներ",
      pricingTitle: "Գնային ուղեցույց",
      readyTitle: "Պատրա՞ստ եք պլանավորել ձեր Դիլիջանի հանգիստը",
      sendBookingRequest: "Ուղարկել ամրագրման հարցում",
      placeholderNote: "Փոխարինվող կարծիք. հետագայում այստեղ ավելացրեք իրական հյուրի կարծիք։",
    },
    horseRiding: {
      title: "Ձիավարություն Դիլիջանում",
      subtitle: "Հանգիստ բնության փորձառություն նրանց համար, ովքեր ուզում են դանդաղել և մոտիկից զգալ լանդշաֆտը։",
      heroCta: "Ավելացնել ամրագրման հարցմանը",
      aboutTitle: "Ճկուն ձիավարություն ձեր խմբի համար",
      about:
        "Ձիավարությունը ճկուն է. պարտադիր չէ, որ բոլոր հյուրերը ձիավարեն, և խումբը կարող է ընտրել 1, 2, 3, 4 կամ ավելի ձիավարության տեղ՝ ըստ հետաքրքրության և հասանելիության։",
      beginnerText: "Սկսնակների համար հարմար ուղեկցման մանրամասները կարելի է քննարկել մինչ ամրագրումը հաստատելը։",
      priceText: `Գին՝ ${horsePrice.toLocaleString("hy-AM")} AMD մեկ հեծյալի մեկ ժամի համար։`,
      included: ["1 ժամ ձիավարություն", "Բնության երթուղի", "Լուսանկարվելու հնարավորություն", "Ճկուն հեծյալների քանակ"],
      reviews: [
        ["Փոխարինվող ձիավարության կարծիք 1", "Այստեղ հետագայում կարող եք ավելացնել հյուրի նշում ձիավարության ռիթմի և բնության մասին։"],
        ["Փոխարինվող ձիավարության կարծիք 2", "Այստեղ հետագայում կարող եք ավելացնել հյուրի նշում սկսնակների հարմարության կամ խմբային ճկունության մասին։"],
        ["Փոխարինվող ձիավարության կարծիք 3", "Այստեղ հետագայում կարող եք ավելացնել հյուրի նշում լուսանկարների, տեսարանների կամ ուղեկցման մասին։"],
      ],
      cta: "Փորձել ձիավարություն",
    },
    jeepTour: {
      title: "Լեռնային ջիպ տուր Դիլիջանում",
      subtitle: "Արկածային լեռնային փորձառություն լայն տեսարաններով, գեղեցիկ կանգառներով և թարմ լեռնային օդով։",
      heroCta: "Ավելացնել ամրագրման հարցմանը",
      aboutTitle: "Պարզ ներկայացված լեռնային տուր",
      about:
        "Մեկ ջիպ մեքենան նախատեսված է մինչև 4 մարդու համար և արժե 60,000 AMD։ 5-8 հյուրի համար անհրաժեշտ է 2 մեքենա։ 9 հյուրի համար կարող է անհրաժեշտ լինել 3 մեքենա։",
      availabilityNote: "Ճշգրիտ երթուղին և հասանելիությունը հաստատվում են ամրագրումից առաջ։",
      included: ["Լեռնային ջիպ երթուղի", "Վարորդ", "Գեղեցիկ կանգառներ", "Լուսանկարվելու հնարավորություններ", "Հարմար է խմբերի համար"],
      pricing: [
        [`1-${jeepCapacity} հյուր`, `1 մեքենա = ${jeepCarPrice.toLocaleString("hy-AM")} AMD`],
        ["5-8 հյուր", `2 մեքենա = ${(jeepCarPrice * 2).toLocaleString("hy-AM")} AMD`],
        ["9 հյուր", `3 մեքենա = ${(jeepCarPrice * 3).toLocaleString("hy-AM")} AMD`],
      ],
      pricingNote: "Լավագույն արժեքը 4 կամ 8 հոգանոց խմբերի համար է։",
      reviews: [
        ["Փոխարինվող ջիպ տուրի կարծիք 1", "Այստեղ հետագայում կարող եք ավելացնել հյուրի նշում լեռնային տեսարանների և կանգառների մասին։"],
        ["Փոխարինվող ջիպ տուրի կարծիք 2", "Այստեղ հետագայում կարող եք ավելացնել հյուրի նշում խմբային հարմարության կամ վարորդի մասին։"],
        ["Փոխարինվող ջիպ տուրի կարծիք 3", "Այստեղ հետագայում կարող եք ավելացնել հյուրի նշում արկածի կամ լուսանկարների մասին։"],
      ],
      cta: "Փորձել ջիպ տուր",
    },
  },
  ru: {
    shared: {
      backHome: "Назад на главную",
      includedTitle: "Что включено",
      galleryTitle: "Галерея",
      reviewsTitle: "Отзывы гостей",
      pricingTitle: "Пояснение цены",
      readyTitle: "Готовы спланировать отдых в Дилижане?",
      sendBookingRequest: "Отправить запрос на бронь",
      placeholderNote: "Черновой отзыв, позже замените его реальным отзывом гостя.",
    },
    horseRiding: {
      title: "Прогулки на лошадях в Дилижане",
      subtitle: "Спокойный опыт на природе для гостей, которые хотят замедлиться и почувствовать пейзаж ближе.",
      heroCta: "Добавить в запрос",
      aboutTitle: "Гибкая прогулка для вашей группы",
      about:
        "Прогулка на лошадях гибкая: не каждому гостю обязательно кататься, а группа может выбрать 1, 2, 3, 4 или больше мест в зависимости от интереса и доступности.",
      beginnerText: "Детали сопровождения для новичков можно обсудить до подтверждения брони.",
      priceText: `Цена: ${horsePrice.toLocaleString("ru-RU")} AMD за всадника в час.`,
      included: ["1 час прогулки", "Маршрут на природе", "Возможность для фото", "Гибкое количество всадников"],
      reviews: [
        ["Черновой отзыв о лошадях 1", "Здесь позже можно добавить заметку гостя о темпе прогулки и природе."],
        ["Черновой отзыв о лошадях 2", "Здесь позже можно добавить заметку гостя о комфорте для новичков или гибкости для группы."],
        ["Черновой отзыв о лошадях 3", "Здесь позже можно добавить заметку гостя о фото, видах или сопровождении."],
      ],
      cta: "Попробовать прогулку",
    },
    jeepTour: {
      title: "Горный джип-тур в Дилижане",
      subtitle: "Приключение в горах с широкими видами, красивыми остановками и свежим горным воздухом.",
      heroCta: "Добавить в запрос",
      aboutTitle: "Понятные условия горного тура",
      about:
        "Одна машина вмещает до 4 человек и стоит 60,000 AMD. Для 5-8 гостей нужны 2 машины. Для 9 гостей может понадобиться 3 машины.",
      availabilityNote: "Точный маршрут и доступность подтверждаются до бронирования.",
      included: ["Горный маршрут на джипе", "Водитель", "Живописные остановки", "Возможности для фото", "Удобно для групп"],
      pricing: [
        [`1-${jeepCapacity} гостя`, `1 машина = ${jeepCarPrice.toLocaleString("ru-RU")} AMD`],
        ["5-8 гостей", `2 машины = ${(jeepCarPrice * 2).toLocaleString("ru-RU")} AMD`],
        ["9 гостей", `3 машины = ${(jeepCarPrice * 3).toLocaleString("ru-RU")} AMD`],
      ],
      pricingNote: "Лучшая ценность для групп из 4 или 8 человек.",
      reviews: [
        ["Черновой отзыв о джип-туре 1", "Здесь позже можно добавить заметку гостя о горных видах и остановках."],
        ["Черновой отзыв о джип-туре 2", "Здесь позже можно добавить заметку гостя об удобстве для группы или водителе."],
        ["Черновой отзыв о джип-туре 3", "Здесь позже можно добавить заметку гостя об ощущении приключения или фото."],
      ],
      cta: "Попробовать джип-тур",
    },
  },
};

export const experiences = {
  horseRiding: {
    path: "/horse-riding",
    bookingActivity: "horse",
    heroImage: "/images/horse-riding-1.jpg",
    fallbackHeroImage:
      "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&w=2200&q=85",
    gallery: [
      "/images/horse-riding-1.jpg",
      "/images/horse-riding-2.jpg",
      "/images/horse-riding-3.jpg",
      "/images/horse-riding-4.jpg",
    ],
    fallbackGallery: [
      "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  jeepTour: {
    path: "/jeep-tour",
    bookingActivity: "jeep",
    heroImage: "/images/jeep-tour-1.jpg",
    fallbackHeroImage:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2200&q=85",
    gallery: [
      "/images/jeep-tour-1.jpg",
      "/images/jeep-tour-2.jpg",
      "/images/jeep-tour-3.jpg",
      "/images/jeep-tour-4.jpg",
      "/images/mountain-1.jpg",
      "/images/mountain-2.jpg",
    ],
    fallbackGallery: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    ],
  },
};
