/// Ubah teks bebas menjadi slug: lowercase, karakter non-alfanumerik
/// (termasuk spasi) menjadi satu tanda hubung, tanpa hubung di ujung.
fn slugify(text: &str) -> String {
    let mut result = String::new();
    let mut last_was_hyphen = true;

    for ch in text.trim().to_lowercase().chars() {
        if ch.is_alphanumeric() {
            result.push(ch);
            last_was_hyphen = false;
        } else if !last_was_hyphen {
            result.push('-');
            last_was_hyphen = true;
        }
    }

    result.trim_end_matches('-').to_string()
}

/// "Ivan", "Aura" -> "ivan-aura"
pub fn generate_couple_slug(groom_name: &str, bride_name: &str) -> String {
    format!("{}-{}", slugify(groom_name), slugify(bride_name))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generates_simple_slug() {
        assert_eq!(generate_couple_slug("Ivan", "Aura"), "ivan-aura");
    }

    #[test]
    fn handles_multi_word_names_and_extra_spaces() {
        assert_eq!(
            generate_couple_slug("  Ivan  Pratama ", "Aura Kasih"),
            "ivan-pratama-aura-kasih"
        );
    }

    #[test]
    fn strips_unsafe_characters() {
        assert_eq!(generate_couple_slug("D'Angelo", "O'Brien"), "d-angelo-o-brien");
    }
}
