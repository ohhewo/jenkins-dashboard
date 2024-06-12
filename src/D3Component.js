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
        .attr('width', 1200)
        .attr('height', 800)
        .style('border', '1px solid #ccc');

      // Clear previous content
      svg.selectAll('*').remove();

      // Group jobs by team
      const teams = d3.groups(jobs, d => d.team);

      // Calculate container heights
      const containerHeights = teams.map(([team, teamJobs]) => ({
        team,
        height: Math.ceil(teamJobs.length / 5) * 150 + 100 // Adjust height to accommodate team name
      }));

      let currentY = 20;

      // Tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("border", "1px solid #000")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "#000");

      teams.forEach(([team, teamJobs], teamIndex) => {
        const teamHeight = containerHeights[teamIndex].height;

        const teamContainer = svg.append('g')
          .attr('class', 'team-container')
          .attr('transform', `translate(20, ${currentY})`);

        teamContainer.append('rect')
          .attr('width', 1150)
          .attr('height', teamHeight)
          .attr('stroke', '#fff')
          .attr('fill', 'none')
          .attr('rx', 10)
          .attr('ry', 10);

        teamContainer.append('text')
          .attr('x', 30)
          .attr('y', 30)
          .text(team)
          .attr('font-size', '18px')
          .attr('fill', '#fff');

        const jobContainers = teamContainer.selectAll(`g.team-${teamIndex}-job`)
          .data(teamJobs)
          .enter()
          .append('g')
          .attr('class', `team-${teamIndex}-job`)
          .attr('transform', (d, i) => `translate(${(i % 5) * 200 + 50}, ${Math.floor(i / 5) * 150 + 70})`)
          .on("mouseover", function (event, d) {
            tooltip.html(`
              <strong>${d.name}</strong><br/>
              Last build: ${d.lastBuild}<br/>
              Last success: ${d.lastSuccessfulBuild}<br/>
              Last fail: ${d.lastFailedBuild}<br/>
              Duration: ${d.lastBuildDuration}
            `)
              .style("visibility", "visible");
          })
          .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });

        jobContainers.append('circle')
          .attr('r', 30)
          .attr('fill', d => {
            if (d.color === 'blue') return 'green';
            if (d.color === 'red') return 'red';
            return 'gray'; // for other statuses
          });

        jobContainers.append('text')
          .attr('class', 'job-name')
          .attr('x', 50)
          .attr('y', 0)
          .text(d => d.name)
          .attr('font-size', '14px')
          .attr('fill', '#fff');

        currentY += teamHeight + 20; // Add some space between team containers
      });
    }
  }, [jobs]);

  return (
    <div className="dashboard">
      {error ? <div className="error">Error: {error}</div> : <svg ref={d3Container}></svg>}
    </div>
  );
};

export default D3Component;
