
const ORCID = "0009-0005-2314-647X";

const container = document.getElementById("publications-list");

async function loadPublications() {
  try {
    const params = new URLSearchParams({
      filter: `authorships.author.orcid:${ORCID}`,
      sort: "publication_date:desc",
      per_page: "100"
    });
    
  const apiUrl = new URL("https://api.openalex.org/works");

apiUrl.searchParams.set(
  "filter",
  `authorships.author.orcid:${ORCID}`
);

apiUrl.searchParams.set("sort", "publication_date:desc");
apiUrl.searchParams.set("per_page", "100");

console.log("OpenAlex request:", apiUrl.toString());

const response = await fetch(apiUrl.toString());

    if (!response.ok) {
  const errorDetails = await response.text();
  throw new Error(
    `OpenAlex HTTP ${response.status}: ${errorDetails}`
  );
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

      
      // Publication venue
      const venue =
        work.primary_location?.source?.display_name ||
        "Research publication";
      
      // Publication metadata
      const meta = document.createElement("p");
      meta.className = "meta";
      
      // Add authors individually
      const authorships = work.authorships || [];
      
      authorships.forEach((entry, index) => {
        const name = entry.author?.display_name || "";
      
        if (!name) return;
      
        if (index > 0) {
          meta.appendChild(document.createTextNode(", "));
        }
      
        // Highlight my name
        if (name.toLowerCase().includes("kalabizadeh")) {
          const boldName = document.createElement("strong");
          boldName.textContent = name;
          meta.appendChild(boldName);
        } else {
          meta.appendChild(document.createTextNode(name));
        }
      });
      
      // Add venue and publication year
      meta.appendChild(
        document.createTextNode(` · ${venue}, ${year}`)
      );


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
