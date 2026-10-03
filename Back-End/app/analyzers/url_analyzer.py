import re
import tldextract

def analyze_url_service(url: str):
    indicators = []
    risk_score = 0
    
    # IP address instead of domain
    if re.search(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b', url):
        indicators.append("IP address used instead of domain")
        risk_score += 20
        
    # @ symbol in URL
    if '@' in url:
        indicators.append("@ symbol present in URL")
        risk_score += 15
        
    # Excessively long URLs
    if len(url) > 75:
        indicators.append("Excessively long URL")
        risk_score += 10
        
    # Too many subdomains
    ext = tldextract.extract(url)
    if ext.subdomain.count('.') >= 2:
        indicators.append("Too many subdomains")
        risk_score += 10
        
    # Punycode domains
    if 'xn--' in url:
        indicators.append("Punycode domain detected")
        risk_score += 25
        
    return {
        "risk_score": min(risk_score, 100),
        "indicators": indicators,
        "evidence_type": "heuristic"
    }
