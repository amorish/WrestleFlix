import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
}

export function Terms({ onBack }: TermsProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="page-title">Legal & Security</h1>
      </div>
      <div className="page-content glass-effect">
        <section className="terms-section">
          <h2>Disclaimer Regarding Content Ownership</h2>
          <p className="page-text">
            WrestleFlix acts strictly as an organized, curated directory designed to facilitate the discovery of professional wrestling content. We want to explicitly state that <strong>WrestleFlix does not host, upload, or provide direct file access to any of the videos showcased on this platform.</strong> 
          </p>
          <p className="page-text">
            All multimedia content available here is publicly accessible on the internet and is embedded via third-party video sharing platforms, primarily YouTube and DailyMotion, utilizing their standard, publicly available embed iframe APIs. We do not claim any copyright, trademark, or ownership over any of the wrestling promotions, brands, logos, or video footage featured. All intellectual property remains entirely with its respective owners, including but not limited to WWE, AEW, NJPW, TNA, and other independent promotions. If you are a copyright owner and believe your content should not be embedded here, please contact the host platform directly (e.g., YouTube) to request the video's removal, which will automatically reflect across our directory.
          </p>
        </section>
        <section className="terms-section">
          <h2>Data & Content Sources</h2>
          <p className="page-text">
            WrestleFlix is a community-driven curation project. The match lists, event metadata, and generated ratings are aggregated from publicly available wrestling databases, community forums (such as Reddit), and historical archives. Our video sources are exclusively linked via official or publicly accessible uploads on platforms such as YouTube, DailyMotion, Bilibili, X (formerly Twitter), VK, and others. All match and event images are sourced from public search engines, promotional materials, or community contributions, and remain the property of their respective copyright holders. We do not claim original ownership of this raw data or imagery; our platform serves solely as an organized index to help fans navigate this publicly available history.
          </p>
        </section>

        <section className="terms-section">
          <h2>Terms of Use</h2>
          <p className="page-text">
            By accessing and utilizing WrestleFlix, you inherently agree to our terms of service. This website is provided purely for informational, archival, and entertainment purposes. We strive to maintain accurate metadata and categorization for all matches, but we cannot guarantee the absolute precision or perpetual availability of embedded third-party videos. The curators reserve the right to modify, remove, or update directory listings at any time without prior notice. 
          </p>
          <p className="page-text">
            Users are expected to utilize this directory responsibly. Any attempt to scrape our database, reverse-engineer our platform, or utilize WrestleFlix for commercial purposes without explicit permission is strictly prohibited.
          </p>
        </section>

        <section className="terms-section">
          <h2>Security & Privacy Commitment</h2>
          <p className="page-text">
            Your privacy and digital security are paramount to us. WrestleFlix operates with a strict data minimization philosophy. We do not require account registration, nor do we track, collect, or store unnecessary personal identification data while you browse our directory. 
          </p>
          <p className="page-text">
            Any feedback or communication provided to us through our contact forms is transmitted via standard secure email protocols. We treat all correspondence with strict confidentiality and will never sell, distribute, or leverage your email address for unsolicited marketing or third-party data sharing. Your experience here is meant to be completely secure, unobtrusive, and focused entirely on the wrestling content you love.
          </p>
        </section>
      </div>
    </div>
  );
}
