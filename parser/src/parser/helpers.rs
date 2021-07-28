use std::collections::HashMap;
use wasm_bindgen::{JsValue, prelude::*};
use lazy_static::lazy_static;
use regex::Regex;

pub fn find_imports(js_value: &str) -> impl Iterator<Item = &str> {
    lazy_static! {
        static ref IMPORTS_REGEX: Regex = Regex::new(
        r#"import[ \s\w\t\r\n\f,_\{\}]+from[ \s]+("|')+(?P<import_id>.+)("|')[ \s]*;"#
            // actual regex to be used, after converted 
            // r#"__customRequire\(__webpack_require__,\s*\\?("|')(?<import_id>\.\.?\/[\w.\s/-]+)\\?("|')"#
        ).unwrap();
    }

    IMPORTS_REGEX
        .captures_iter(js_value)
        .map(|c| c.name("import_id"))
        .flatten()
        .map(|m| m.as_str())
}

pub fn compare_key_to_path(key: &str, path: &str) -> bool {
    key == path || 
    key == format!("{}.js", path) || 
    key == format!("{}/index.js", path)
}

pub fn find_by_path<'v>(entries: &'v HashMap<String, String>, path: &'v str)  -> Option<&'v String> {
    entries
        .iter()
        .find(| item | compare_key_to_path(item.0, path))
        .map(|item| item.1)
}

// it will call a function to convert that uses babel standalone
pub fn transform(value: &str) -> String {
    format!("#{}#", value)
}

pub fn get_ext(path: &str) -> Option<&str> {
    lazy_static!{ 
        static ref EXT_REG: Regex = Regex::new(r#"\.\w+$"#).unwrap();
    }

    EXT_REG.captures(path)
        .and_then(|cap| cap.get(0))
        .and_then(| m | Some(m.as_str()))
}

#[wasm_bindgen(raw_module = "../src/transpiling/transformers.js", )]
extern "C" {
    #[wasm_bindgen(js_name = "reactJsTransform" )]
    pub fn react_js_transform(rawCode: &str) -> String;
}
