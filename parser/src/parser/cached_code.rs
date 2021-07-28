use std::{cell::{Ref, RefMut}, collections::HashMap};
use super::helpers::compare_key_to_path;

#[derive(Debug, Clone)]
pub struct CachedCodeItem {
    pub raw: String,
    pub transpiled: String,
    pub ext: String,
}

impl CachedCodeItem {
    pub fn new(raw: String, transpiled: String, ext: String) -> Self { 
        Self { raw, transpiled, ext } 
    }
}

pub trait CachedCode {
    fn get_cache(&self) ->  Ref<HashMap<String, CachedCodeItem>>;
	fn get_mut_cache(&self) ->  RefMut<HashMap<String, CachedCodeItem>>;

    fn add_to_cache(&self, path: &str, value: String, parsed_value: String, ext: &str) {
        self.get_mut_cache()
            .insert(
                path.to_string(), 
                CachedCodeItem::new(value, parsed_value, ext.to_string())
            );
    }

    fn get_from_cache(&self, path: &str) -> Option<(String, CachedCodeItem)> {
        let map = self.get_cache()
            .iter()
            .find(| (key, _) | {
                compare_key_to_path(key, path)
            })
            .map(| (key, value)| ( key.to_string(), value.clone()));
            
        if map.is_some() {
            println!("Key {} found.", path);
        }
        
        map
    }
}

#[cfg(test)]
mod test {
    use std::cell::{Ref, RefMut};
    use std::time::Instant;
    use std::{cell::RefCell, collections::HashMap};

    use super::CachedCode;
    use super::CachedCodeItem;

    struct StubCache {
        cache: RefCell<HashMap<String, CachedCodeItem>> 
    }

    impl StubCache {
        fn new(cache: RefCell<HashMap<String, CachedCodeItem>>) -> Self { Self { cache } }
    }

    impl CachedCode for StubCache {
        fn get_cache(&self) ->  Ref<HashMap<String, CachedCodeItem>> {
            self.cache.borrow()
        }
    
        fn get_mut_cache(&self) ->  RefMut<HashMap<String, CachedCodeItem>> {
            self.cache.borrow_mut()
        }
    }

    fn get_args<'a>() -> (String, String, String, String) {
        (
            format!("{:?}", Instant::now()),
            format!("{:?}", Instant::now()),
            format!("{:?}", Instant::now()),
            format!("{:?}", Instant::now()),
        )
    }

    #[test]
    fn adds_successfully_to_the_cache() {
        let cache = RefCell::new(HashMap::new());

        let stub = StubCache::new(cache);

        let args = get_args();

        stub.add_to_cache(args.0.as_str(), args.1.clone(), args.2.clone(), args.3.as_str());

        let stub_cache = stub.get_cache(); 
        assert!(stub_cache.contains_key(args.0.as_str()));
        
        let cached = stub_cache.get(args.0.as_str()).unwrap();

        assert_eq!(cached.raw, args.1);
        assert_eq!(cached.transpiled, args.2);
        assert_eq!(cached.ext, args.3.as_str());
    }
}

#[cfg(test)]
mod test_2 {
    #[test]
    fn nhonho() {
        use mockall::*;
        use mockall::predicate::*;
        #[automock]
        trait Nhonho {
            fn foo(&self, x: u32) -> u32;
        }
        
        fn call_with_four(x: &Nhonho) -> u32 {
            x.foo(4)
        }
        
        let mut mock = MockNhonho::new();
        mock.expect_foo()
            .with(predicate::eq(4))
            .times(1)
            .returning(|x| x + 1);
        assert_eq!(5, call_with_four(&mock));
    }
}