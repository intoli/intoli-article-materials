((time) => {
  const handleDocumentLoaded = () => {
    document.getElementById("injected-time").innerHTML = time;
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleDocumentLoaded);
  } else {
    handleDocumentLoaded();
  }
})(Date.now());
