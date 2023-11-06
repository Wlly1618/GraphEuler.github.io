class Graph
{
  constructor() {
    this.adjacency_list = new Map();
    this.matrix = [];
    this.degrees = [];
    this.euler = [];
    this.type = '';
    this.total_degrees = 0;
    this.symmetric = false;
    this.related = false;
    this.eulerian = false;
  }

  addVertex(key, value) {
    if (typeof key === 'string' && Array.isArray(value)) {
      this.adjacency_list.set(key, value);
    } else {
      throw new Error("Can't create");
    }

    this.makeMatrix();
  }

  isSymmetric() {
    this.symmetric = true;
    const n = this.matrix.length;
    const m = this.matrix[0].length;
    let flag = true;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < m; j++) {
        if (this.matrix[i][j] !== this.matrix[j][i]) {
          this.symmetric = false;
          flag = false;
          break;
        }
      }
      if (!flag) break;
    }
  }

  isEulerian() {
    if (this.symmetric && this.related) {
      const oddDegreeNodes = this.degrees.filter(degree => degree % 2 === 1);
      if (oddDegreeNodes.length === 0) {
        this.type = 'Circuit';
        this.circuitEuler();
        return true;
      }
      if (oddDegreeNodes.length === 2) {
        this.type = 'Road';
        this.roadEuler(oddDegreeNodes);
        return true;
      }
    }
    return false;
  }

  makeMatrix() {
    const temp_list = this.adjacency_list.keys();

    const temp_map = new Map(this.adjacency_list);
    this.related = true;
    this.matrix = [];
    this.total_degrees = 0;

    for (const [vertex, edges] of temp_map) {
      let cont = 0;
      let row = [];
      for (const temp_vertex of temp_list) {
        let flag = false;
        if (edges.includes(temp_vertex)) {
          edges.splice(edges.indexOf(temp_vertex), 1);
          cont += (vertex !== temp_vertex) ? 1 : 2;
          flag = true;
        }
        row.push(flag);
      }
      this.matrix.push(row);
      this.degrees.push(cont);
      this.total_degrees += cont;
      if (cont === 0) {
        this.related = false;
      }
    }

    console.log(this.matrix);
  }

  showGraph() {
    let graphContent = "";
    for (const [vertex, edges] of this.adjacency_list) {
      graphContent += `Vertex: ${vertex}\tEdges: ${edges.join(', ')}\n`;
    }
    document.getElementById("graphContent").textContent = graphContent;
  }

  showInformation()
  {
    let str_symmetric = 'false';
    let str_related = 'false';
    let str_eulerian = 'false';
    if (this.symmetric) {
      str_symmetric = 'true';
    }

    if (this.related) {
      str_related = 'true';
    }

    if (this.eulerian) {
      str_eulerian = 'true';
    }

    let str_degrees = [];
    this.degrees.forEach(data => {str_degrees.push(`${data}`)})
    let graphInformation = `
      Degrees: ${str_degrees}
      Total Degrees: ${this.total_degrees}
      Symmetrix: ${str_symmetric}
      Related: ${str_related}
      Eulerian: ${str_eulerian}
    `;

    document.getElementById("graphInfo").textContent = graphInformation;
  }
}

const graph = new Graph();

document.getElementById("addVertexBtn").addEventListener("click", () => {
  const vertexInput = document.getElementById("vertexInput");
  const edgesInput = document.getElementById("edgesInput");

  const vertex = vertexInput.value;
  const edges = edgesInput.value.split(",").map(edge => edge.trim());

  if (vertex && edges.length > 0) {
    graph.addVertex(vertex, edges);
    graph.showGraph();
  } else {
    alert("Please enter a vertex and at least one edge.");
  }

  vertexInput.value = "";
  edgesInput.value = "";
});

document.getElementById("loadBtn").addEventListener("click", () =>
{
  graph.showInformation();
});