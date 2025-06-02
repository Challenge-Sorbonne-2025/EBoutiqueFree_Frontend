// Import required libraries
import ApexCharts from 'apexcharts';
import Sortable from 'sortablejs';

// Import styles
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'apexcharts/dist/apexcharts.css';

// jsvectormap is loaded globally via CDN
declare global {
  interface Window {
    jsVectorMap: any;
  }
}

export { ApexCharts, Sortable }; 