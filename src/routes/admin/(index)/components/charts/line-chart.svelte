<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
  let chartInstance: Chart | null = $state(null);

  const pendingValues: number[] = [1, 2, 3, 4, 5, 6];
  const pendingLabels: string[] = ['1', '2', '3', '4', '5', '6'];

  const acceptedValues: number[] = [1, 2, 3, 4, 5, 6];
  const acceptedLabels: string[] = ['1', '2', '3', '4', '5', '6'];

  const canceledValues: number[] = [1, 2, 3, 4, 5, 6];
  const canceledLabels: string[] = ['1', '2', '3', '4', '5', '6'];

  onMount(async () => {
    if (typeof window !== 'undefined') {
      createChart();
    }
  });

  function createChart() {
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    chartInstance = new Chart(ctx, {
      type: 'line', // Changed to 'line'
      data: {
        labels: pendingLabels,
        datasets: [
          {
            label: 'Pendings this month',
            backgroundColor: '#000000',
            borderColor: '#000000',
            data: pendingValues,
            tension: 0.4
          },
          {
            label: 'Accepted this month',
            backgroundColor: '#000000',
            borderColor: '#000000',
            data: acceptedValues,
            tension: 0.4
          },
          {
            label: 'Canceled this month',
            backgroundColor: '#000000',
            borderColor: '#000000',
            data: canceledValues,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            offset: true
          },
          y: {
            display: true,
            offset: true
          }
        },
        plugins: {}
      }
    });
  }

  /* $effect(() => {
      if (chartInstance) {
        chartInstance.data.datasets[0].backgroundColor = theme.get();
        chartInstance.data.datasets[0].borderColor = theme.get();
        chartInstance.update();
      }
    }); */
</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>

<style>
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>
