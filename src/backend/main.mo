import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import AccessControl "./authorization/access-control";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";

actor {
  // ---- Authorization state ----
  let accessControlState = AccessControl.initState();

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) Runtime.trap("CAFFEINE_ADMIN_TOKEN environment variable is not set");
      case (?adminToken) AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // ---- Article type ----
  public type Article = {
    id : Nat;
    title : Text;
    content : Text;
    category : Text;
    imageUrl : Text;
    author : Text;
    excerpt : Text;
    date : Text;
    isBreaking : Bool;
    isSlider : Bool;
    isPublished : Bool;
  };

  // ---- State ----
  var nextId : Nat = 9;
  let articles = Map.empty<Nat, Article>();
  var categories : [Text] = ["রাজনীতি", "খেলাধুলা", "বিনোদন", "আন্তর্জাতিক", "প্রযুক্তি", "অর্থনীতি", "স্বাস্থ্য"];
  var breakingNewsText : Text = "ঢাকায় আজ বড় ট্রাফিক জ্যাম • সংসদে নতুন বিল পাস • আন্তর্জাতিক ক্রিকেট দলের বাংলাদেশ সফর নিশ্চিত • ঢাকা স্টক এক্সচেঞ্জে সূচক বৃদ্ধি • নতুন শিক্ষা নীতি ঘোষণা";
  var logoUrl : Text = "";

  // ---- Seed data initialization ----
  do {
    articles.add(1, {
      id = 1;
      title = "জাতীয় সংসদে নতুন বাজেট অধিবেশন শুরু, অর্থমন্ত্রীর বক্তব্য";
      content = "আজ সোমবার জাতীয় সংসদে ২০২৬-২৭ অর্থবছরের বাজেট অধিবেশন শুরু হয়েছে। অর্থমন্ত্রী তার বক্তব্যে দেশের অর্থনৈতিক উন্নয়নের চিত্র তুলে ধরেন।";
      category = "রাজনীতি";
      imageUrl = "https://picsum.photos/800/450?random=1";
      author = "মোহাম্মদ রফিকুল ইসলাম";
      excerpt = "বাজেট অধিবেশনে অর্থমন্ত্রী উন্নয়নমূলক প্রকল্পের ঘোষণা দেন।";
      date = "৫ এপ্রিল ২০২৬";
      isBreaking = true;
      isSlider = true;
      isPublished = true;
    });
    articles.add(2, {
      id = 2;
      title = "বাংলাদেশ ক্রিকেট দল ভারতের বিপক্ষে ঐতিহাসিক জয় অর্জন করেছে";
      content = "চট্টগ্রামে অনুষ্ঠিত টেস্ট ম্যাচে বাংলাদেশ ক্রিকেট দল ভারতকে ৭ উইকেটে হারিয়ে ঐতিহাসিক জয় অর্জন করেছে।";
      category = "খেলাধুলা";
      imageUrl = "https://picsum.photos/800/450?random=2";
      author = "সুমাইয়া আক্তার";
      excerpt = "চট্টগ্রামে টেস্ট ম্যাচে বাংলাদেশ ভারতকে ৭ উইকেটে হারিয়ে ঐতিহাসিক জয় অর্জন।";
      date = "৫ এপ্রিল ২০২৬";
      isBreaking = true;
      isSlider = true;
      isPublished = true;
    });
    articles.add(3, {
      id = 3;
      title = "ঢাকা আন্তর্জাতিক চলচ্চিত্র উৎসবে বাংলাদেশি চলচ্চিত্র সেরা পুরস্কার জিতেছে";
      content = "ঢাকায় অনুষ্ঠিত ২২তম আন্তর্জাতিক চলচ্চিত্র উৎসবে বাংলাদেশি চলচ্চিত্র সেরা পুরস্কার অর্জন করেছে।";
      category = "বিনোদন";
      imageUrl = "https://picsum.photos/800/450?random=3";
      author = "নাসরিন সুলতানা";
      excerpt = "ঢাকায় ২২তম আন্তর্জাতিক চলচ্চিত্র উৎসবে বাংলাদেশি চলচ্চিত্র সেরা পুরস্কার অর্জন।";
      date = "৪ এপ্রিল ২০২৬";
      isBreaking = false;
      isSlider = true;
      isPublished = true;
    });
    articles.add(4, {
      id = 4;
      title = "জাতিসংঘে বাংলাদেশের প্রস্তাব সর্বসম্মতিক্রমে গৃহীত হয়েছে";
      content = "জাতিসংঘ সাধারণ পরিষদে বাংলাদেশের উত্থাপিত জলবায়ু পরিবর্তন মোকাবেলা সংক্রান্ত প্রস্তাবটি সর্বসম্মতিক্রমে গৃহীত হয়েছে।";
      category = "আন্তর্জাতিক";
      imageUrl = "https://picsum.photos/800/450?random=4";
      author = "আরিফ হোসেন";
      excerpt = "জাতিসংঘ সাধারণ পরিষদে বাংলাদেশের জলবায়ু প্রস্তাব সর্বসম্মতিক্রমে গৃহীত।";
      date = "৪ এপ্রিল ২০২৬";
      isBreaking = true;
      isSlider = true;
      isPublished = true;
    });
    articles.add(5, {
      id = 5;
      title = "বাংলাদেশে ৫জি নেটওয়ার্ক পরীক্ষামূলকভাবে চালু হচ্ছে আগামী মাসে";
      content = "বাংলাদেশ টেলিযোগাযোগ নিয়ন্ত্রণ কমিশন ঘোষণা করেছে যে আগামী মে মাস থেকে ৫জি পরীক্ষামূলকভাবে চালু হবে।";
      category = "প্রযুক্তি";
      imageUrl = "https://picsum.photos/800/450?random=5";
      author = "শিরীন আখতার";
      excerpt = "আগামী মে মাস থেকে ঢাকা ও চট্টগ্রামে পরীক্ষামূলকভাবে ৫জি নেটওয়ার্ক চালু হবে।";
      date = "৩ এপ্রিল ২০২৬";
      isBreaking = false;
      isSlider = false;
      isPublished = true;
    });
    articles.add(6, {
      id = 6;
      title = "দেশে নতুন কর্মসংস্থান নীতি ঘোষণা, লক্ষাধিক তরুণ উপকৃত হবেন";
      content = "সরকার নতুন কর্মসংস্থান নীতি ঘোষণা করেছে যার আওতায় আগামী পাঁচ বছরে ২০ লক্ষ নতুন কর্মসংস্থান সৃষ্টির লক্ষ্যমাত্রা।";
      category = "অর্থনীতি";
      imageUrl = "https://picsum.photos/800/450?random=6";
      author = "জাহিদুল হক";
      excerpt = "নতুন কর্মসংস্থান নীতিতে আগামী পাঁচ বছরে ২০ লক্ষ নতুন কর্মসংস্থান।";
      date = "৩ এপ্রিল ২০২৬";
      isBreaking = false;
      isSlider = false;
      isPublished = true;
    });
    articles.add(7, {
      id = 7;
      title = "দেশব্যাপী বিনামূল্যে টিকাদান কর্মসূচি শুরু হচ্ছে সোমবার থেকে";
      content = "স্বাস্থ্য মন্ত্রণালয় ঘোষণা করেছে যে আগামী সোমবার থেকে দেশব্যাপী বিনামূল্যে ডেঙ্গু টিকাদান কর্মসূচি শুরু হবে।";
      category = "স্বাস্থ্য";
      imageUrl = "https://picsum.photos/800/450?random=7";
      author = "ফারহানা বেগম";
      excerpt = "সোমবার থেকে দেশব্যাপী বিনামূল্যে ডেঙ্গু টিকাদান কর্মসূচি শুরু হবে।";
      date = "২ এপ্রিল ২০২৬";
      isBreaking = false;
      isSlider = true;
      isPublished = true;
    });
    articles.add(8, {
      id = 8;
      title = "প্রিমিয়ার লিগে আবাহনী লিমিটেড চ্যাম্পিয়ন হয়েছে";
      content = "বাংলাদেশ ফুটবল প্রিমিয়ার লিগে আবাহনী লিমিটেড এবারের মৌসুমে চ্যাম্পিয়ন হয়েছে।";
      category = "খেলাধুলা";
      imageUrl = "https://picsum.photos/800/450?random=8";
      author = "রাজিব আহমেদ";
      excerpt = "ফুটবল প্রিমিয়ার লিগে আবাহনী লিমিটেড মোহামেডানকে ৩-১ গোলে হারিয়ে চ্যাম্পিয়ন।";
      date = "২ এপ্রিল ২০২৬";
      isBreaking = false;
      isSlider = false;
      isPublished = true;
    });
  };

  // ---- Article queries ----
  public query func getAllArticles() : async [Article] {
    var result : [Article] = [];
    for (a in articles.values()) {
      result := result.concat([a]);
    };
    result;
  };

  public query func getPublishedArticles() : async [Article] {
    var result : [Article] = [];
    for (a in articles.values()) {
      if (a.isPublished) { result := result.concat([a]) };
    };
    result;
  };

  public query func getSliderArticles() : async [Article] {
    var result : [Article] = [];
    for (a in articles.values()) {
      if (a.isSlider and a.isPublished) { result := result.concat([a]) };
    };
    result;
  };

  public query func getBreakingArticles() : async [Article] {
    var result : [Article] = [];
    for (a in articles.values()) {
      if (a.isBreaking and a.isPublished) { result := result.concat([a]) };
    };
    result;
  };

  public query func getArticlesByCategory(category : Text) : async [Article] {
    var result : [Article] = [];
    for (a in articles.values()) {
      if (a.category == category and a.isPublished) { result := result.concat([a]) };
    };
    result;
  };

  public query func getArticleById(id : Nat) : async ?Article {
    articles.get(id);
  };

  // ---- Article mutations ----
  public shared ({ caller }) func addArticle(
    title : Text,
    content : Text,
    category : Text,
    imageUrl : Text,
    author : Text,
    excerpt : Text,
    date : Text,
    isBreaking : Bool,
    isSlider : Bool,
    isPublished : Bool,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add articles");
    };
    let id = nextId;
    let article : Article = { id; title; content; category; imageUrl; author; excerpt; date; isBreaking; isSlider; isPublished };
    articles.add(id, article);
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updateArticle(
    id : Nat,
    title : Text,
    content : Text,
    category : Text,
    imageUrl : Text,
    author : Text,
    excerpt : Text,
    date : Text,
    isBreaking : Bool,
    isSlider : Bool,
    isPublished : Bool,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };
    switch (articles.get(id)) {
      case (null) { false };
      case (?_) {
        let article : Article = { id; title; content; category; imageUrl; author; excerpt; date; isBreaking; isSlider; isPublished };
        articles.add(id, article);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    articles.remove(id);
    true;
  };

  // ---- Categories ----
  public query func getCategories() : async [Text] {
    categories;
  };

  public shared ({ caller }) func addCategory(category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    categories := categories.concat([category]);
  };

  public shared ({ caller }) func removeCategory(category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    categories := categories.filter(func(c : Text) : Bool { c != category });
  };

  // ---- Breaking news ticker ----
  public query func getBreakingNewsText() : async Text {
    breakingNewsText;
  };

  public shared ({ caller }) func setBreakingNewsText(text : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    breakingNewsText := text;
  };

  // ---- Logo ----
  public query func getLogoUrl() : async Text {
    logoUrl;
  };

  public shared ({ caller }) func setLogoUrl(url : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update logo");
    };
    logoUrl := url;
  };
};
