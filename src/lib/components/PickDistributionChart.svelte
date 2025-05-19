<script lang="ts">
  import { onMount } from 'svelte';
  import captainsData from '$lib/data/captains.json';
  
  const props = $props<{
    pickPositions: number[];
    maxPickPosition: number;
  }>();
  
  let chartElement;
  let chart;
  let isMounted = false;
  
  // Function to get color based on team position
  function getBarColor(position: number): string {
    // Map positions to colors based on captains.json
    if ([1, 12, 13, 24].includes(position)) return '#10b981'; // green-500
    if ([2, 11, 14, 23].includes(position)) return '#ec4899'; // pink-500
    if ([3, 10, 15, 22].includes(position)) return '#0ea5e9'; // sky-500
    if ([4, 9, 16, 21].includes(position)) return '#fbbf24'; // amber-400
    if ([5, 8, 17, 20].includes(position)) return '#eab308'; // yellow-500
    if ([6, 7, 18, 19].includes(position)) return '#ef4444'; // red-500
    return '#9ca3af'; // gray-400
  }
  
  // Generate chart data and initialize chart
  function updateChart() {
    if (!isMounted || !props.pickPositions) return;
    
    // Count occurrences of each position
    const distribution = Array(props.maxPickPosition).fill(0);
    
    props.pickPositions.forEach(pos => {
      if (pos > 0 && pos <= props.maxPickPosition) {
        distribution[pos-1]++;
      }
    });
    
    // Generate position colors
    const positionColors = Array(props.maxPickPosition).fill('').map((_, i) => getBarColor(i+1));
    
    // Import ApexCharts dynamically
    import('apexcharts').then(ApexCharts => {
      // Destroy existing chart if it exists
      if (chart) {
        chart.destroy();
      }
      
      // Create chart options
      const options = {
        series: [{
          name: 'Picked',
          data: distribution
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          }
        },
        colors: positionColors,
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '80%',
            distributed: true,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        xaxis: {
          categories: Array.from({ length: props.maxPickPosition }, (_, i) => (i + 1).toString()),
          title: {
            text: 'Pick Position'
          }
        },
        yaxis: {
          title: {
            text: 'Times Picked'
          }
        },
        tooltip: {
          custom: function(opts) {
            const position = parseInt(opts.w.globals.labels[opts.dataPointIndex]);
            const count = opts.series[opts.seriesIndex][opts.dataPointIndex];
            
            // Find which captain's team this position belongs to
            let teamInfo = "";
            for (const captain of captainsData) {
              if (captain.positions.includes(position)) {
                teamInfo = `<div class="font-semibold">${captain.team} (${captain.name})</div>`;
                break;
              }
            }
            
            return `<div class="px-2 py-1">
              <div class="font-bold">Position ${position}</div>
              ${teamInfo}
              <div>Picked ${count} ${count === 1 ? 'time' : 'times'}</div>
            </div>`;
          },
          theme: 'light',
          x: {
            show: false
          }
        },
        grid: {
          borderColor: '#e2e8f0', // slate-200
          strokeDashArray: 4,
          padding: {
            bottom: 5
          }
        },
        stroke: {
          width: 1,
          colors: ['transparent']
        }
      };
      
      // Initialize chart
      chart = new ApexCharts.default(chartElement, options);
      chart.render();
    });
  }
  
  // Watch for changes in props
  $effect(() => {
    if (props.pickPositions && isMounted) {
      updateChart();
    }
  });
  
  // Initialize chart on client-side only
  onMount(() => {
    isMounted = true;
    updateChart();
    
    // Cleanup on destroy
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });
</script>

<div class="w-full">
  <div bind:this={chartElement} class="apex-charts"></div>
</div>

<style>
  .apex-charts {
    width: 100%;
    height: 350px;
  }
</style>