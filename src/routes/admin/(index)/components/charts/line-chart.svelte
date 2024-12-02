<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  interface Props {
    accepted: GraphCountsType['accepted'];
    canceled: GraphCountsType['canceled'];
    pending: GraphCountsType['pending'];
  }

  let { accepted, canceled, pending }: Props = $props();

  let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
  let chartInstance: Chart | null = $state(null);

  const pendingValues: number[] = pending.map((item) => item.count);
  const pendingLabels: string[] = pending.map((item) => item.day);

  const acceptedValues: number[] = accepted.map((item) => item.count);
  const acceptedLabels: string[] = accepted.map((item) => item.day);

  const canceledValues: number[] = canceled.map((item) => item.count);
  const canceledLabels: string[] = canceled.map((item) => item.day);

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
