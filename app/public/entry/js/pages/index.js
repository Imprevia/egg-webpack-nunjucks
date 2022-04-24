async function indexPage() {
  const [jquery, common] = await Promise.all([
    import("jquery"),
    import("./common"),
  ]);
  const $ = jquery.default;
  $("div").click(function () {
    $("body").css({ background: "red" });
    alert(222222);
  });
}
indexPage();
