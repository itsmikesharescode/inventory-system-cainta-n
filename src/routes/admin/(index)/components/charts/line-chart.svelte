<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let chartCanvas: HTMLCanvasElement | undefined = $state(undefined);
  let chartInstance: Chart | null = $state(null);

  interface Props {
    pendings: { date: string; count: number }[];
    approved: { date: string; count: number }[];
    rejected: { date: string; count: number }[];
  }

  const { pendings, approved, rejected }: Props = $props();

  const pendingValues: number[] = pendings.map((item) => item.count);
  const pendingLabels: string[] = pendings.map((item) => item.date);

  const approvedValues: number[] = approved.map((item) => item.count);
  const approvedLabels: string[] = approved.map((item) => item.date);

  const rejectedValues: number[] = rejected.map((item) => item.count);
  const rejectedLabels: string[] = rejected.map((item) => item.date);

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
            label: 'Approved this month',
            backgroundColor: '#000000',
            borderColor: '#000000',
            data: approvedValues,
            tension: 0.4
          },
          {
            label: 'Rejected this month',
            backgroundColor: '#000000',
            borderColor: '#000000',
            data: rejectedValues,
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
