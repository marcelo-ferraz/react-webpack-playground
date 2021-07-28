mod helpers;
mod cached_code;

use std::{cell::{Ref, RefCell, RefMut}, collections::HashMap};
use cached_code::CachedCodeItem;
use helpers::{get_ext, find_imports, find_by_path, react_js_transform};
use cached_code::CachedCode;

pub struct Parser {
    cache: RefCell<HashMap<String, CachedCodeItem>> 
}

impl Parser {
    pub fn new() -> Self { 
        Self { 
            cache: RefCell::new(HashMap::new())
        } 
    }
    
    pub fn parse_and_shake(&self, entries: &HashMap<String, String>, path: &str) -> Option<HashMap<String, String>> {
        let mut result: HashMap<String, String> = HashMap::new();

        self.search_entries_within(path, &entries, &mut result);
        
        Some(result)
    }
    
    fn transform_js(&self, path: &str, value: &str, ext: &str) -> String {
        let parsed_value;
        match self.get_from_cache(path) {
            Some(cached) => {
                let cached_value = cached.1;
                let same_len = value.len() == cached_value.raw.len();
                let same_val = value == cached_value.raw;

                if same_len && same_val {
                    parsed_value = cached_value.transpiled.clone();
                } else {
                    parsed_value = react_js_transform(value);
                    self.add_to_cache(path, value.to_string(), parsed_value.clone(), ext);
                }
            },
            None => {
                parsed_value = react_js_transform(value);
                self.add_to_cache(path, value.to_string(), parsed_value.clone(), ext);
            },
        }
        parsed_value
    }

    fn search_entries_within<'a>(&self, path: &'a str, entries: &'a HashMap<String, String>, result:&'a mut HashMap<String, String>) -> &'a mut HashMap<String, String> {
        if result.contains_key(path) {()}

        if let Some(value) = find_by_path(entries, path) {
            // todo: only try to convert and js, jsx files, 
            // json should just be eval'd and,
            // css, scss, ts and tsx still need to be given support

            let ext = get_ext(path).unwrap_or(".js");

            let parsed_value = match ext {
                ".js" | ".jsx" => self.transform_js(path, value, ext),
                ".ts" | ".tsx" => todo!("to be implemented"),
                ".scss" => todo!("to be implemented"),
                ".css" => todo!("to be implemented"),
                &_ => value.to_string()
            };
            
            result.insert(path.to_string(), parsed_value.clone());
            
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
