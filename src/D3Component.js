// src/D3Component.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './D3Component.css';

const D3Component = () => {
  const d3Container = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/jobs')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data fetched from backend:', data);
        setJobs(data);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    if (d3Container.current && jobs.length) {
      const svg = d3.select(d3Container.current)
        .attr('width', 1000)
        .attr('height', 600)
        .style('border', '1px solid #ccc');

      // Clear previous content
      svg.selectAll('*').remove();

      // Calculate positions
      const circleX = (i) => (i % 5) * 200 + 50;
      const circleY = (i) => Math.floor(i / 5) * 200 + 50;

      // Append circles
      svg.selectAll('circle')
        .data(jobs)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => circleX(i))
        .attr('cy', (d, i) => circleY(i))
        .attr('r', 30)
        .attr('fill', d => {
          if (d.color === 'blue') return 'green';
          if (d.color === 'red') return 'red';
          return 'gray'; // for other statuses
        })
        .append('title')
        .text(d => `${d.name}: ${d.color}`);

      // Append job names
      svg.selectAll('text.job-name')
        .data(jobs)
        .enter()
        .append('text')
        .attr('class', 'job-name')
        .attr('x', (d, i) => circleX(i) + 50)  // Adjust position to the right of the circle
        .attr('y', (d, i) => circleY(i) - 20)  // Position slightly above the center
        .text(d => d.name)
        .attr('font-size', '14px')
        .attr('fill', '#fff');

      // Append last build statuses
      svg.selectAll('text.job-time')
        .data(jobs)
        .enter()
        .append('text')
        .attr('class', 'job-time')
        .attr('x', (d, i) => circleX(i) + 50)  // Adjust position to the right of the circle
        .attr('y', (d, i) => circleY(i))  // Position slightly below the center
        .text(d => `Last build: ${d.lastBuild}`) // Assuming lastBuild is available
        .attr('font-size', '12px')
        .attr('fill', '#ccc');

      // Append last successful build times
      svg.selectAll('text.last-success')
        .data(jobs)
        .enter()
        .append('text')
        .attr('class', 'last-success')
        .attr('x', (d, i) => circleX(i) + 50)  // Adjust position to the right of the circle
        .attr('y', (d, i) => circleY(i) + 20)  // Position slightly below the last build status
        .text(d => `Last success: ${d.lastSuccessfulBuild}`)
        .attr('font-size', '12px')
        .attr('fill', '#ccc');

      // Append last failed build times
      svg.selectAll('text.last-fail')
        .data(jobs)
        .enter()
        .append('text')
        .attr('class', 'last-fail')
        .attr('x', (d, i) => circleX(i) + 50)  // Adjust position to the right of the circle
        .attr('y', (d, i) => circleY(i) + 40)  // Position slightly below the last successful build
        .text(d => `Last fail: ${d.lastFailedBuild}`)
        .attr('font-size', '12px')
        .attr('fill', '#ccc');

      // Append last build durations
      svg.selectAll('text.last-duration')
        .data(jobs)
        .enter()
        .append('text')
        .attr('class', 'last-duration')
        .attr('x', (d, i) => circleX(i) + 50)  // Adjust position to the right of the circle
        .attr('y', (d, i) => circleY(i) + 60)  // Position slightly below the last failed build
        .text(d => `Duration: ${d.lastBuildDuration} ms`)
        .attr('font-size', '12px')
        .attr('fill', '#ccc');
    }
  }, [jobs]);

  return (
    <div className="dashboard">
      {error ? <div className="error">Error: {error}</div> : <svg ref={d3Container}></svg>}
    </div>
  );
};

export default D3Component;