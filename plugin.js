/**
 * Yod Paste Code - plugin.js
 *
 * Copyright, THRSH (thrsh.net)
 * Released under LGPL License.
 *
 *  v1.0 - 1:25 AM 1/12/2014
 *  v1.1 - 12:54 AM 9/7/2014
**/

const
  yod_var = "yodpaste",
  yod_tooltip = "Yod Paste Code",
  yod_title = "YPC",

  // input id, name, label
  yod_lang = "yodlang",
  yod_lang_label = "Classname",
  yod_lang_custom = "yodcustomlang",
  yod_lang_custom_label = "Custom Classname",
  yod_source = "yodsource",
  yod_source_label = "Source",
  yod_lang_no = "No Language",

  // tag wrap
  yod_tag_wrap_open = "", // <pre>
  yod_tag_wrap_close = "", // </pre>
  yod_tag_open = "[", // <
  yod_tag_close_slash = "/",
  yod_tag_close = "]", // >
  yod_tag_open_class = " class=\"",
  yod_tag_close_class = "\"",
  yod_tag_name = "code";

var
  langs = [],
  langs_def = {text: yod_lang_no, value: ""},
  // add your own
  langs_array = [
    "bat", "css", "javascript", "php", "sh", "sql"
  ];

tinymce.PluginManager.add(yod_var, function(editor) {
  editor.addButton(yod_var, {
    text: yod_title,
    icon: "code",
    tooltip: yod_tooltip,
    onclick: yodInit
  });

  editor.addMenuItem(yod_var, {
    text: yod_tooltip,
    icon: "code",
    context: "insert",
    onclick: yodInit
  });

  function escapeHtml(s) {
    return s
    .replace(/&/gm, "&amp;")
    .replace(/</gm, "&lt;")
    .replace(/>/gm, "&gt;")
    .replace(/"/gm, "&quot;")
    .replace(/'/gm, "&#039;");
  }

  function gelEl(id) {
    return document.getElementById(id);
  }

  function yodEntity(s) {
    var ta, id = "yod_textdump";

    if (!(ta = gelEl(id))) {
      ta = document.createElement("textarea");
      ta.setAttribute("id", id);
      ta.setAttribute("style", "display:none");
      document.body.appendChild(ta);
    }

    ta.value = escapeHtml(s);

    return ta.value
      .replace(/(\r\n|\r|\n)/gmi, "<br>")
      .split("\t").join("&nbsp;&nbsp;")
      .split(" ").join("&nbsp;");
  }

  function setValue(key, value, not) {
    localStorage.setItem(key, value.toString());
    return false;
  }

  function getValue(key, def) {
    var val = localStorage.getItem(key);
    return val;
  }

  function yodProccess(e) {
    var lang = "", source = yodEntity(e.data[yod_source]);
    lang += e.data[yod_lang] + " ";
    lang += e.data[yod_lang_custom] + " ";
    if (lang = lang.trim()) {
      source =
        yod_tag_wrap_open
        + yod_tag_open + yod_tag_name + yod_tag_open_class + lang + yod_tag_close_class + yod_tag_close
        + source
        + yod_tag_open + yod_tag_close_slash + yod_tag_name + yod_tag_close;
        + yod_tag_wrap_close;
    }
    editor.focus();
    editor.insertContent(source);
    editor.selection.setCursorLocation();
  }

  function yodClick() {
    editor.windowManager.open({
      title: yod_tooltip,
      body: [
        {
          type: 'listbox',
          id: yod_lang,
          name: yod_lang,
          label: yod_lang_label,
          values: langs,
          value: getValue(yod_lang, langs[0].value)
        },
        {
          type: 'textbox',
          id: yod_lang_custom,
          name: yod_lang_custom,
          label: yod_lang_custom_label,
          value: getValue(yod_lang_custom),
        },
        {
          type: "textbox",
          id: yod_source,
          name: yod_source,
          label: yod_source_label,
          minWidth: 320,
          minHeight: editor.getParam("code_dialog_height", Math.min(tinymce.DOM.getViewPort().h - 200, 320)),
          flex: 1,
          multiline: true
        }
      ],
      onClose: function() {
        var yod_lang_str = gelEl(yod_lang).textContent.trim().toLowerCase();
        yod_lang_str = yod_lang_str != yod_lang_no.trim().toLowerCase() ? yod_lang_str : "";
        setValue(yod_lang, yod_lang_str);
        setValue(yod_lang_custom, gelEl(yod_lang_custom).value.trim());
      },
      onsubmit: yodProccess
    });
  }

  function yodInit() {
    langs_array.sort();

    for (var a in langs_array) {
      var lang_tmp = langs_array[a].trim().toLowerCase();
      langs.push({text: lang_tmp, value: lang_tmp});
    }

    langs.unshift(langs_def);

    yodClick();
  }
});