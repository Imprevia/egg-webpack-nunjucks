import $ from "jquery";
async function indexPage() {
  const common = await import("./common");
  common.log(111111);
  $("div").click(function () {
    alert(222222);
  });
}
indexPage();
