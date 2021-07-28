mod parser;

use std::collections::HashMap;
use wasm_bindgen::{JsValue, prelude::*};
use js_sys::Map;

use parser::Parser;

#[wasm_bindgen]
pub struct JsParser {
	parser: Parser
}

#[wasm_bindgen]
impl JsParser {
    pub fn new() -> Self { 
        Self { parser: Parser::new() } 
    }

	pub fn parse(&self, project: &Map, path: &str) -> JsValue {

		assert!(!project.is_undefined());
		assert!(project.is_object());
		
		let entries: HashMap<String, String> = project.into_serde().unwrap();

        self.parser
            .parse_and_shake(&entries, path)
            .and_then(|r| JsValue::from_serde(&r).ok())
            .unwrap_or(JsValue::NULL)
	}
}

