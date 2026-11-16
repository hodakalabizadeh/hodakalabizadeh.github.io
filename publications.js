
const ORCID = "0009-0005-2314-647X";

const container = document.getElementById("publications-list");

async function loadPublications() {
  try {
    const params = new URLSearchParams({
      filter: `authorships.author.orcid:${ORCID}`,
      sort: "-publication_date",
      per_page: "100"
    });

    const response = await fetch(
      `https://api.openalex.org/works?${params}`
    );

    if (!response.ok) {
      throw new Error("Could not retrieve publications");
    }

    const data = await response.json();
    const works = data.results || [];

    container.replaceChildren();

    if (works.length === 0) {
      container.textContent =
        "No publications found. View my Google Scholar profile.";
      return;
    }

    let currentYear = null;

    works.forEach(work => {
      const year = work.publication_year || "Other";

      if (year !== currentYear) {
        const heading = document.createElement("h2");
        heading.className = "year";
        heading.textContent = year;
        container.appendChild(heading);
        currentYear = year;
      }

      const article = document.createElement("article");
      article.className = "publication";

      const title = document.createElement("h3");
      title.textContent = work.title || "Untitled";

      const authors = (work.authorships || [])
        .map(a => a.author?.display_name)
        .filter(Boolean)
        .join(", ");

      const venue =
        work.primary_location?.source?.display_name ||
        "Research publication";

      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = `${authors} · ${venue}, ${year}`;

      const link = document.createElement("a");
      link.href = work.doi || work.id;
      link.textContent = "Read paper →";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      article.append(title, meta, link);
      container.appendChild(article);
    });

  } catch (error) {
    console.error(error);
    container.textContent =
      "Publications are temporarily unavailable. Please visit my Google Scholar profile.";
  }
}

loadPublications();
