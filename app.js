// 數位場記板 — localStorage 自動保存
(function () {
  "use strict";

  var STORAGE_KEY = "clapperboard.v1";
  var TEXT_FIELDS = ["device", "location", "date", "type"];
  var COUNTERS = ["scene", "shot", "take"];
  var ALL_FIELDS = TEXT_FIELDS.concat(COUNTERS);

  function el(id) {
    return document.getElementById(id);
  }

  function save() {
    var data = {};
    ALL_FIELDS.forEach(function (id) {
      data[id] = el(id).value;
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* 隱私模式等情況下忽略 */
    }
  }

  function load() {
    var raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return;
    }
    if (!raw) return;
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return;
    }
    ALL_FIELDS.forEach(function (id) {
      if (data[id] != null && data[id] !== "") {
        el(id).value = data[id];
      }
    });
  }

  // 計數器的 +/- 按鈕
  function bumpCounter(id, delta) {
    var input = el(id);
    var current = parseInt(input.value, 10);
    if (isNaN(current)) current = 0;
    var next = current + delta;
    if (next < 0) next = 0;
    input.value = String(next);
    save();
  }

  function init() {
    load();

    // 所有輸入變動即存
    ALL_FIELDS.forEach(function (id) {
      el(id).addEventListener("input", save);
      el(id).addEventListener("change", save);
    });

    // 計數器按鈕
    document.querySelectorAll(".counter button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        bumpCounter(btn.dataset.target, parseInt(btn.dataset.delta, 10));
      });
    });

    // 計數器輸入框限制為數字
    COUNTERS.forEach(function (id) {
      el(id).addEventListener("input", function () {
        var cleaned = el(id).value.replace(/[^0-9]/g, "");
        if (cleaned !== el(id).value) el(id).value = cleaned;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
