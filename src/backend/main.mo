import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import AccessControl "./authorization/access-control";
import Outcall "./http-outcalls/outcall";
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

  // If no admin exists yet, first authenticated caller claims admin role.
  // Otherwise, registers caller as regular user (if not yet registered).
  public shared ({ caller }) func claimAdminIfNoneExists() : async Bool {
    AccessControl.claimAdminIfNoneExists(accessControlState, caller);
    AccessControl.isAdmin(accessControlState, caller);
  };

  // ---- HTTP Transform (required for http outcalls) ----
  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
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
  var breakingNewsText : Text = "ঢাকায় আজ বড় ট্রাফিক জ্যাম • সংসদে নতুন বিল পাস • আন্তর্জাতিক ক্রিকেট দলের বাংলাদেশ সফর নিশ্চিত";
  var logoUrl : Text = "";

  // ---- Reporter type ----
  public type Reporter = {
    name : Text;
    email : Text;
    role : Text;
    phone : Text;
  };

  // ---- Site Settings (v1 - legacy migration stub) ----
  // This stable variable holds the old 4-field settings from the previous version.
  // It is read once in postupgrade to migrate data, then ignored.
  type SiteSettings_v1 = {
    siteName : Text;
    tagline : Text;
    contactEmail : Text;
    footerText : Text;
  };
  var siteSettings : SiteSettings_v1 = {
    siteName = "বালিগাঁও নিউজ";
    tagline = "বালিগাঁওয়ের বিশ্বস্ত সংবাদ";
    contactEmail = "baligawnews.bd@gmail.com";
    footerText = "";
  };

  // ---- Site Settings (v2 - current) ----
  public type SiteSettings = {
    siteName : Text;
    tagline : Text;
    contactEmail : Text;
    footerText : Text;
    editorName : Text;
    editorEmail : Text;
    editorPhone : Text;
    address : Text;
    reporters : [Reporter];
  };

  // siteSettings_v2 holds current settings; migrated from siteSettings in postupgrade
  var siteSettings_v2 : SiteSettings = {
    siteName = "বালিগাঁও নিউজ";
    tagline = "বালিগাঁওয়ের বিশ্বস্ত সংবাদ";
    contactEmail = "baligawnews.bd@gmail.com";
    footerText = "";
    editorName = "";
    editorEmail = "";
    editorPhone = "";
    address = "";
    reporters = [];
  };

  public query func getSiteSettings() : async SiteSettings {
    siteSettings_v2;
  };

  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update site settings");
    };
    siteSettings_v2 := settings;
  };

  // ---- RSS Feed types ----
  public type RSSItem = {
    id : Nat;
    title : Text;
    description : Text;
    link : Text;
    pubDate : Text;
    source : Text;
    category : Text;
    fetchedAt : Int;
  };

  public type FeedSource = {
    url : Text;
    name : Text;
    category : Text;
    enabled : Bool;
  };

  // ---- RSS State ----
  var nextRSSId : Nat = 1;
  var rssItems : [RSSItem] = [];
  var lastFetchTime : Int = 0;
  var feedSources : [FeedSource] = [
    { url = "https://feeds.bbci.co.uk/bengali/rss.xml"; name = "BBC বাংলা"; category = "আন্তর্জাতিক"; enabled = true },
    { url = "https://www.prothomalo.com/feed"; name = "প্রথম আলো"; category = "রাজনীতি"; enabled = true },
    { url = "https://www.ittefaq.com.bd/feed"; name = "ইত্তেফাক"; category = "রাজনীতি"; enabled = true },
    { url = "https://www.aljazeera.com/xml/rss/all.xml"; name = "আল জাজিরা"; category = "আন্তর্জাতিক"; enabled = true },
    { url = "https://www.banglaedition.com/feed"; name = "বাংলা এডিশন"; category = "রাজনীতি"; enabled = false },
  ];

  // ---- Simple XML text extraction helper ----
  func extractTag(xml : Text, tag : Text) : Text {
    let openTag = "<" # tag # ">";
    let closeTag = "</" # tag # ">";
    let cdataOpen = "<![CDATA[";
    let cdataClose = "]]>";
    let parts = xml.split(#text openTag);
    switch (parts.next()) {
      case (null) { "" };
      case (?_) {
        switch (parts.next()) {
          case (null) { "" };
          case (?afterOpen) {
            let innerParts = afterOpen.split(#text closeTag);
            switch (innerParts.next()) {
              case (null) { "" };
              case (?content) {
                if (content.startsWith(#text cdataOpen)) {
                  let afterCdata = content.split(#text cdataOpen);
                  switch (afterCdata.next()) {
                    case (null) { content };
                    case (?_) {
                      switch (afterCdata.next()) {
                        case (null) { content };
                        case (?inner) {
                          let beforeClose = inner.split(#text cdataClose);
                          switch (beforeClose.next()) {
                            case (null) { inner };
                            case (?stripped) { stripped };
                          };
                        };
                      };
                    };
                  };
                } else {
                  content;
                };
              };
            };
          };
        };
      };
    };
  };

  func splitItems(xml : Text) : [Text] {
    let itemOpen = "<item>";
    let itemClose = "</item>";
    var items : [Text] = [];
    let chunks = xml.split(#text itemOpen);
    switch (chunks.next()) {
      case (null) {};
      case (?_) {
        label outerLoop loop {
          switch (chunks.next()) {
            case (null) { break outerLoop };
            case (?chunk) {
              let innerParts = chunk.split(#text itemClose);
              switch (innerParts.next()) {
                case (null) {};
                case (?content) {
                  items := items.concat([content]);
                };
              };
            };
          };
        };
      };
    };
    items;
  };

  func parseRSSItems(xml : Text, sourceName : Text, category : Text, startId : Nat) : ([RSSItem], Nat) {
    let itemBlocks = splitItems(xml);
    var parsed : [RSSItem] = [];
    var idCounter = startId;
    for (block in itemBlocks.vals()) {
      let title = extractTag(block, "title");
      let link = extractTag(block, "link");
      let description = extractTag(block, "description");
      let pubDate = extractTag(block, "pubDate");
      if (title != "") {
        let item : RSSItem = {
          id = idCounter;
          title = title;
          description = description;
          link = link;
          pubDate = pubDate;
          source = sourceName;
          category = category;
          fetchedAt = Time.now();
        };
        parsed := parsed.concat([item]);
        idCounter += 1;
      };
    };
    (parsed, idCounter);
  };

  // ---- RSS public API ----
  public shared ({ caller }) func refreshAllFeeds() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can refresh feeds");
    };
    var allItems : [RSSItem] = [];
    var idCounter = 1;
    for (source in feedSources.vals()) {
      if (source.enabled) {
        try {
          let xml = await Outcall.httpGetRequest(source.url, [], transform);
          let (items, nextId) = parseRSSItems(xml, source.name, source.category, idCounter);
          allItems := allItems.concat(items);
          idCounter := nextId;
        } catch (_) {};
      };
    };
    let limited = if (allItems.size() > 200) {
      allItems.sliceToArray(0, 200);
    } else {
      allItems;
    };
    rssItems := limited;
    nextRSSId := idCounter;
    lastFetchTime := Time.now();
    allItems.size();
  };

  public query func getRSSItems() : async [RSSItem] {
    let arr = rssItems;
    var reversed : [RSSItem] = [];
    var i = arr.size();
    while (i > 0) {
      i -= 1;
      reversed := reversed.concat([arr[i]]);
    };
    reversed;
  };

  public query func getRSSItemsByCategory(category : Text) : async [RSSItem] {
    var result : [RSSItem] = [];
    for (item in rssItems.vals()) {
      if (item.category == category) {
        result := result.concat([item]);
      };
    };
    var reversed : [RSSItem] = [];
    var i = result.size();
    while (i > 0) {
      i -= 1;
      reversed := reversed.concat([result[i]]);
    };
    reversed;
  };

  public query func getLastFetchTime() : async Int {
    lastFetchTime;
  };

  public query func getFeedSources() : async [FeedSource] {
    feedSources;
  };

  public shared ({ caller }) func toggleFeedSource(url : Text, enabled : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    feedSources := feedSources.map(func(s : FeedSource) : FeedSource {
      if (s.url == url) { { s with enabled = enabled } } else { s };
    });
  };

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

  // ---- Migration: copy v1 siteSettings to v2 on upgrade ----
  system func postupgrade() {
    // Only migrate if v2 still has the default siteName (i.e., first upgrade)
    if (siteSettings_v2.siteName == "বালিগাঁও নিউজ" and siteSettings_v2.contactEmail == "baligawnews.bd@gmail.com") {
      siteSettings_v2 := {
        siteName = siteSettings.siteName;
        tagline = siteSettings.tagline;
        contactEmail = siteSettings.contactEmail;
        footerText = siteSettings.footerText;
        editorName = "";
        editorEmail = "";
        editorPhone = "";
        address = "";
        reporters = [];
      };
    };
  };

};