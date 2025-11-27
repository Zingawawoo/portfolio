document.addEventListener("DOMContentLoaded", function () {
  // ----- Footer year -----
  var yearSpan = document.getElementById("year");
  if (yearSpan) {
    var now = new Date();
    yearSpan.textContent = now.getFullYear();
  }

  // ----- Section navigation -----
  var body = document.body;
  var sectionBlocks = document.querySelectorAll(".section-view");
  var navButtons = document.querySelectorAll(".nav-link-btn");
  var introButtons = document.querySelectorAll(".intro-btn");
  var aboutJumpButtons = document.querySelectorAll("[data-section='projects'].btn");
  var appStarted = false;
  var currentSectionId = null;

  function setActiveSection(sectionId) {
    // Hide all sections immediately
    sectionBlocks.forEach(function (section) {
      section.classList.remove("active");
    });

    var target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    // Show + animate this section
    target.classList.add("active");
    currentSectionId = sectionId;

    // Update header nav states
    navButtons.forEach(function (btn) {
      var targetAttr = btn.getAttribute("data-section");
      if (targetAttr === sectionId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function openSection(sectionId) {
    if (!sectionId) {
      return;
    }

    // If you click the same section again, do nothing
    if (sectionId === currentSectionId) {
      return;
    }

    // First time: hide intro + show header
    if (!appStarted) {
      appStarted = true;
      body.classList.add("app-started");
    }

    setActiveSection(sectionId);

    var main = document.querySelector(".main");
    if (main) {
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function wireButtons(buttons) {
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        var targetSection = btn.getAttribute("data-section");
        if (targetSection) {
          event.preventDefault();
          openSection(targetSection);
        }
      });
    });
  }

  wireButtons(introButtons);
  wireButtons(navButtons);
  wireButtons(aboutJumpButtons);

  // ----- Projects data & rendering -----

  var projects = [
    {
      title: "GDD_Web",
      tag: "Systems & Web",
      description:
        "Real-time website for the Game Development & Design Society with integrated chat and society tools, self-hosted on a Raspberry Pi and exposed via Cloudflare Tunnel.",
      meta: ["Go", "WebSockets", "Raspberry Pi"],
      categories: ["systems", "society"],
      link: "https://github.com/Zingawawoo/GDD_Web"
    },
    {
      title: "GDD_Repo",
      tag: "Systems & Web",
      description:
        "Central repo for GDD workshops, tutorials, and resources. Used to organise teaching materials, game jam projects, and collaborative workflows for new developers.",
      meta: ["GitHub", "Docs", "Workflows"],
      categories: ["systems", "society"],
      link: "https://github.com/Zingawawoo/GDD_Repo"
    },
    {
      title: "Divine_Departure",
      tag: "Game",
      description:
        "2D isometric RPG built in Godot 4 during a game jam. Worked on gameplay systems, animation behaviour, and UI/UX to produce a polished vertical slice.",
      meta: ["Godot 4", "GDScript", "Game Jam"],
      categories: ["game", "personal"],
      link: "https://github.com/Zingawawoo/Divine_Departure"
    },
    {
      title: "Catalogue",
      tag: "Game",
      description:
        "Browser-based guessing game prototype exploring lightweight UX and game state handling in the web stack. Currently in redevelopment.",
      meta: ["JavaScript", "Web"],
      categories: ["game", "personal"],
      link: "https://github.com/Zingawawoo/Catalogue"
    },
    {
      title: "Distributed Game of Life",
      tag: "Coursework",
      description:
        "Distributed implementation of Conway’s Game of Life in Go, using a broker and EC2 workers with peer-to-peer halo exchange to parallelise large grids.",
      meta: ["Go", "AWS EC2", "Distributed Systems"],
      categories: ["systems", "coursework"],
      link: ""
    },
    {
      title: "IMDb Data Verification",
      tag: "Coursework",
      description:
        "Coursework project for scraping and verifying IMDb metadata, contributing across backend, frontend, and repository maintenance.",
      meta: ["Python", "Scraping", "Full-stack"],
      categories: ["systems", "coursework"],
      link: ""
    }
  ];

  var projectsGrid = document.getElementById("projects-grid");

  function createProjectCard(project) {
    var article = document.createElement("article");
    article.className = "project-card";
    article.setAttribute("data-category", project.categories.join(" "));

    var header = document.createElement("div");
    header.className = "project-header";

    var titleEl = document.createElement("h3");
    titleEl.textContent = project.title;

    var tagEl = document.createElement("span");
    tagEl.className = "project-tag";
    tagEl.textContent = project.tag;

    header.appendChild(titleEl);
    header.appendChild(tagEl);

    var desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = project.description;

    var metaRow = document.createElement("div");
    metaRow.className = "project-meta";
    project.meta.forEach(function (m) {
      var chip = document.createElement("span");
      chip.textContent = m;
      metaRow.appendChild(chip);
    });

    article.appendChild(header);
    article.appendChild(desc);
    article.appendChild(metaRow);

    if (project.link && project.link.length > 0) {
      var linkEl = document.createElement("a");
      linkEl.className = "project-link";
      linkEl.href = project.link;
      linkEl.target = "_blank";
      linkEl.textContent = "View on GitHub →";
      article.appendChild(linkEl);
    }

    return article;
  }

  if (projectsGrid) {
    projects.forEach(function (project) {
      var card = createProjectCard(project);
      projectsGrid.appendChild(card);
    });
  }

  // ----- Filter tabs -----

  var filterTabs = document.querySelectorAll("#project-tabs .tab-btn");

  function applyFilter(filter) {
    var projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach(function (card) {
        var categories = card.getAttribute("data-category");
        var matches = false;

        if (filter === "all") {
        matches = true;
        } else if (categories) {
        var parts = categories.split(" ");
        matches = parts.indexOf(filter) !== -1;
        }

        if (matches) {
        // Show card and animate it in
        card.style.display = ""; // let CSS/grid decide (block)
        card.classList.remove("filter-animate"); // reset animation
        void card.offsetWidth; // force reflow so animation can restart
        card.classList.add("filter-animate");
        } else {
        // Hide card completely so layout closes the gap
        card.style.display = "none";
        card.classList.remove("filter-animate");
        }
    });
    }


  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      filterTabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");

      var filter = tab.getAttribute("data-filter");
      applyFilter(filter);
    });
  });

  // Default: just intro hub on load.
});
