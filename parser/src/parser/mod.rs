mod helpers;
mod cached_code;

use core::panic;
use std::{cell::{Ref, RefCell, RefMut}, collections::HashMap};
use cached_code::CachedCodeItem;
use helpers::{get_ext, find_imports, find_by_path, react_js_transform};
use cached_code::CachedCode;
use lazy_static::lazy_static;
use regex::Regex;

use crate::parser::helpers::log;

pub struct Parser {
    cache: RefCell<HashMap<String, CachedCodeItem>> 
}

impl Parser {
    pub fn new() -> Self { 
        Self { 
            cache: RefCell::new(HashMap::new())
        } 
    }
    
    pub fn parse_and_shake<'a>(&self, entries: &HashMap<String, String>, path: &str) -> Option<HashMap<String, (String, String)>> {
        let mut result: HashMap<String, (String, String)> = HashMap::new();

        self.search_entries_within(path, &entries, &mut result);
        
        Some(result)
    }

    fn transform_js(&self, path: &str, value: &str, ext: &str) -> String {
        lazy_static!{ 
            static ref REQ_REG: Regex = Regex::new(r#"require\("#).unwrap();
        }
        
        self.get_from_cache_or_transform(

            path, value, ext, move || {
                let transformed = react_js_transform(value);

                format!(
                    "(function(module, exports, __webpack_require__) {{ {} }})", 
                    REQ_REG.replace_all(&transformed, "__customRequire(__webpack_require__, "),
                )
            }
        )
    }

    fn search_entries_within<'a>(
        &self, path: &'a str, entries: &'a HashMap<String, String>, result: &'a mut HashMap<String, (String, String)>
    ) -> &'a mut HashMap<String, (String, String)> {
        if result.contains_key(path) {()}

        if let Some(value) = find_by_path(entries, path) {
            // todo: only try to convert and js, jsx files, 
            // json should just be eval'd and,
            // css, scss, ts and tsx still need to be given support

            let ext = get_ext(path).unwrap_or(".js");

            let transformed = match ext {
                ".js" | ".jsx" => self.transform_js(path, value, ext),
                ".ts" | ".tsx" => todo!("to be implemented"),
                ".scss" => todo!("to be implemented"),
                ".css" => todo!("to be implemented"),
                ".json" => value.to_string(),
                &_ => panic!("Unexpected type of file \"{}\"", ext)
            };
            
            result.insert(path.to_string(), (transformed, ext.to_string()));
            
            find_imports(&value).for_each(|import| {
                self.search_entries_within(import, entries, result);
            });
        }

        result
    }
}

impl CachedCode for Parser {
    fn get_cache(&self) ->  Ref<HashMap<String, CachedCodeItem>> {
        self.cache.borrow()
    }

	fn get_mut_cache(&self) ->  RefMut<HashMap<String, CachedCodeItem>> {
        self.cache.borrow_mut()
    }
}
