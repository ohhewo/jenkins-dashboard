// src/CustomCalendarHeatmap.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './CustomCalendarHeatmap.css';

const CustomCalendarHeatmap = () => {
  const calRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/historic-jobs')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched from backend:', data); // Log fetched data

        const heatmapData = data.reduce((acc, job) => {
          const date = new Date(job.timestamp).setHours(0, 0, 0, 0);
          if (!acc[date]) {
            acc[date] = { success: 0, fail: 0, builds: [] };
          }
          acc[date].builds.push(job);
          if (job.result === 'SUCCESS') {
            acc[date].success += 1;
          } else {
            acc[date].fail += 1;
          }
          return acc;
        }, {});

        console.log('Processed heatmap data:', heatmapData); // Log processed data

        const finalData = Object.entries(heatmapData).reduce((acc, [timestamp, counts]) => {
          const total = counts.success + counts.fail;
          const successRate = (counts.success / total) * 100;
          acc[new Date(+timestamp)] = { successRate, builds: counts.builds };
          return acc;
        }, {});

        console.log('Final data for rendering:', finalData); // Log final data
        renderCalendarHeatmap(finalData);
      })
      .catch(error => console.error('Error fetching heatmap data:', error));
  }, []);

  const renderCalendarHeatmap = (data) => {
    const width = 900;
    const height = 150;
    const cellSize = 15; // Reduced cell size
    const padding = 20;

    const svg = d3.select(calRef.current)
      .attr('width', width)
      .attr('height', height * 6); // Adjust height for multiple rows

    const colorScale = d3.scaleLinear()
      .domain([0, 50, 100])
      .range(['#ED4A0D', '#F47A00', '#009C43']); // Gradient colors from Red Gradient 1 to Green Gradient 1

    // Add month labels
    const months = Array.from(new Set(Object.keys(data).map(d => new Date(d).toLocaleString('default', { month: 'long' }))));
    svg.selectAll("text.month")
      .data(months)
      .enter()
      .append("text")
      .attr("class", "month")
      .attr("x", (d, i) => (i % 3) * (width / 3) + padding)
      .attr("y", (d, i) => Math.floor(i / 3) * height + padding)
      .text(d => d)
      .attr("fill", "#000")
      .attr("font-size", "14px"); // Reduced font size

    const allDays = d3.timeDays(new Date(d3.min(Object.keys(data), d => new Date(d))), new Date(d3.max(Object.keys(data), d => new Date(d))));

    const rect = svg.selectAll("rect")
      .data(allDays)
      .enter().append("rect")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", (d, i) => (i % 52) * cellSize + padding)
      .attr("y", (d, i) => Math.floor(i / 52) * cellSize + padding)
      .attr("fill", d => data[d] ? colorScale(data[d].successRate) : "#eeeeee")
      .attr("stroke", "#ccc")
      .attr("stroke-width", "1px");

    rect.append("title")
      .text(d => `${d.toDateString()}\nSuccess Rate: ${data[d] ? data[d].successRate : 'No data'}`);
  };

  return <svg ref={calRef} className="calendar-heatmap"></svg>;
};

export default CustomCalendarHeatmap;
