import * as model from "./model.js";
import searchFormView from "./views/searchFormView.js";
import mrtBarView from "./views/mrtBarView.js";
import indexAttractionView from "./views/indexAttractionView.js";

export const controlIndexAttraction = async function () {
  const attractionSearch = model.state.attractionSearch;
  if (attractionSearch.nextPage === null) return;
  const { nextPage, data: attractionList } = await model.getAttractionList(
    attractionSearch.nextPage,
    attractionSearch.keyword
  );
  indexAttractionView.render(attractionList, true);
  model.state.attractionSearch.nextPage = nextPage;
};

export const controlMrtBar = async function () {
  const mrtList = await model.getMrtList();
  mrtBarView.render(mrtList);
};

export const controlMrtBarScrollToLeft = function () {
  mrtBarView.scrollTo("left");
};

export const controlMrtBarScrollToRight = function () {
  mrtBarView.scrollTo("right");
};

export const controlSearchForm = async function (input) {
  searchFormView.fillInput(input);
};
