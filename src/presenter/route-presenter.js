import EditRouteFormView from '../view/edit-route-form';
import RouteView from '../view/route.js';
import { render, replace, remove } from '../framework/render.js';
import { onEscKeydownDo } from '../utils/common.js';

export default class RoutePresenter {
  #routesContainer;
  #route;
  #routeView;
  #editRouteView;

  #isEditOpen = false;

  #handleDataChange;
  #handleEditorOpen;

  constructor({routesContainer, handleDataChange, handleEditorOpen}) {
    this.#routesContainer = routesContainer;
    this.#handleDataChange = handleDataChange;
    this.#handleEditorOpen = handleEditorOpen;
  }

  init(route) {
    this.#route = route;

    const prevRouteView = this.#routeView;
    const prevEditRouteView = this.#editRouteView;

    this.#routeView = new RouteView({ route: this.#route, onArrowClick: this.#handleOpenEditClick, onFavoriteClick: this.#handleFavoriteClick });
    this.#editRouteView = new EditRouteFormView({ route: this.#route, onArrowClick: this.#handleCloseEditClick });

    if (!prevRouteView || !prevEditRouteView) {
      render(this.#routeView, this.#routesContainer.element);
      return;
    }

    if (this.#routesContainer.element.contains(prevRouteView.element)){
      replace(this.#routeView, prevRouteView);
    }

    if (this.#routesContainer.element.contains(prevEditRouteView.element)){
      replace(this.#editRouteView, prevEditRouteView);
    }

    remove(prevRouteView);
    remove(prevEditRouteView);
  }

  resetView() {
    if(this.#isEditOpen) {
      this.#replaceFormToRoute();
    }
  }

  #replaceRouteToForm() {
    replace(this.#editRouteView, this.#routeView);
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#handleEditorOpen();
    this.#isEditOpen = true;
  }

  #replaceFormToRoute() {
    replace(this.#routeView, this.#editRouteView);
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#isEditOpen = false;
  }

  #escKeydownHandler = onEscKeydownDo(() => {
    this.#replaceFormToRoute(this.#routeView, this.#editRouteView);
    document.removeEventListener('keydown', this.#escKeydownHandler);
  });

  #handleOpenEditClick = () => {
    this.#replaceRouteToForm();
  };

  #handleCloseEditClick = () => {
    this.#replaceFormToRoute();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#route, isFavorite: !this.#route.isFavorite});
  };
}
