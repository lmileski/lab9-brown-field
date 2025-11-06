import { LitElement, html, css } from 'lit';

/**
 * TodoFilter - Filter tabs for displaying All/Active/Completed todos.
 * 
 * @class
 * @extends {LitElement}
 * @fires filter-change - Dispatched when a filter tab is clicked
 * 
 * @property {string} currentFilter - Currently selected filter ('all', 'active', 'completed')
 */
export class TodoFilter extends LitElement {
  static properties = {
    currentFilter: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      margin: 20px 0;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
      background: #f5f5f5;
      padding: 8px;
      border-radius: 8px;
    }

    .filter-tab {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #666;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-tab:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .filter-tab.active {
      background: #667eea;
      color: white;
    }
  `;

  /**
   * Creates a TodoFilter instance.
   */
  constructor() {
    super();
    this.currentFilter = 'all';
  }

  /**
   * Handles filter tab click.
   * 
   * @param {string} filter - Filter type to apply
   */
  handleFilterClick(filter) {
    this.dispatchEvent(new CustomEvent('filter-change', {
      detail: { filter },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="filter-tabs">
        <button
          class="filter-tab ${this.currentFilter === 'all' ? 'active' : ''}"
          @click=${() => this.handleFilterClick('all')}>
          All
        </button>
        <button
          class="filter-tab ${this.currentFilter === 'active' ? 'active' : ''}"
          @click=${() => this.handleFilterClick('active')}>
          Active
        </button>
        <button
          class="filter-tab ${this.currentFilter === 'completed' ? 'active' : ''}"
          @click=${() => this.handleFilterClick('completed')}>
          Completed
        </button>
      </div>
    `;
  }
}

customElements.define('todo-filter', TodoFilter);
