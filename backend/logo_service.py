from urllib.parse import urlparse


def get_clean_domain(url: str):
    # Parse the URL and get the netloc
    parsed_url = urlparse(url)
    domain = parsed_url.netloc

    # Remove common prefixes like 'www.'
    domain = domain.lstrip("www.")

    # Keep only the domain name and TLD
    parts = domain.split(".")
    if len(parts) > 2:  # If subdomains are present
        domain = ".".join(parts[-2:])  # Get the last two parts (name and TLD)

    return domain


def get_logo_url(url: str):
    clean_domain = get_clean_domain(url)
    return f"https://img.logo.dev/{clean_domain}?token=pk_ZU33xC3UQNegMiFkKGIvnw&size=69&retina=true"
