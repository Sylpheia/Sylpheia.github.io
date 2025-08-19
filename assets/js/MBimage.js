window.addEventListener("DOMContentLoaded", async () => {
  const images = document.querySelectorAll("img.album-cover, img.album-thumb");

  for (const img of images) {
    const artist = img.dataset.artist;
    const album = img.dataset.album;
    const mbidFromData = img.dataset.mbid;

    if (!mbidFromData && (!artist || !album)) continue;

    const sidebar = img.closest(".sidebar");
    const dateSpan = sidebar?.querySelector(".releasedate");
    
    try {
      let mbid = mbidFromData;
      if (!mbid) {
        const query = `artist:${encodeURIComponent(artist)} AND releasegroup:${encodeURIComponent(album)} AND (primarytype:album OR primarytype:ep) AND NOT secondarytype:*`;
        const searchUrl = `https://musicbrainz.org/ws/2/release-group/?query=${query}&fmt=json`;

        const res = await fetch(searchUrl);
        const data = await res.json();
        const releaseGroup = data['release-groups']?.[0];
        if (!releaseGroup) continue;

        mbid = releaseGroup.id;
      }

      // 🎵 Set image source depending on class
      if (img.classList.contains("album-thumb")) {
        img.src = `https://coverartarchive.org/release-group/${mbid}/front-250`;
      } else if (img.classList.contains("album-cover")) {
        img.src = `https://coverartarchive.org/release-group/${mbid}/front-500`;
      }

      // 📆 Update release date span if available
      if (dateSpan) {
        const detailRes = await fetch(`https://musicbrainz.org/ws/2/release-group/${mbid}?inc=releases&fmt=json`);
        const detailData = await detailRes.json();

        const sortedReleases = (detailData.releases || [])
          .filter(r => r.date)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        const releaseDate = sortedReleases[0]?.date;
        if (releaseDate) {
          const dt = new Date(releaseDate);
          dateSpan.textContent = dt.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric"
          });
        }
      }
    } catch {
      if (dateSpan) dateSpan.textContent = "Unknown";
      img.alt = "No image found";
    }
  }
});
