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
  }

  async isSymmetric() {
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

  async isEulerian() {
    this.eulerian = false;
    if (this.symmetric && this.related) {
      const oddDegreeNodesIndices = [];
      for (let i = 0; i < this.degrees.length; i++) {
        if (this.degrees[i] % 2 === 1) {
          oddDegreeNodesIndices.push(i);
        }
      }
  
      if (oddDegreeNodesIndices.length === 0) {
        this.type = 'Circuit';
        this.circuitEuler();
        this.eulerian = true;
      }
      if (oddDegreeNodesIndices.length === 2) {
        this.type = 'Road';
        this.roadEuler(oddDegreeNodesIndices);
        this.eulerian = true;
      }
    }
  }
  
  async makeMatrix() {
    const temp_list = Array.from(this.adjacency_list.keys()); // Convertir las claves a un arreglo
    let temp_map = new Map(this.adjacency_list);

    this.related = true;
    this.matrix = [];
    this.degrees = [];
    this.total_degrees = 0;

    for (const [vertex, edges] of temp_map) {
      let cont = 0;
      let row = [];
      for (const temp_vertex of temp_list) {
        let flag = false;
        const edgesCopy = [...edges];
        if (edgesCopy.includes(temp_vertex)) {
          edgesCopy.splice(edgesCopy.indexOf(temp_vertex), 1);
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

    await this.isSymmetric();
    await this.isEulerian();
  }

  circuitEuler() {
    const size = this.total_degrees / 2;
    let start, last;
    const temp = this.adjacency_list;
    const vertex = [...temp.keys()];
    start = vertex[0];
    last = start;
    
    console.log(size);
    console.log(start);
    console.log(last);
    this.doEuler(temp, size, start, last);
  }

  roadEuler(startLast) {
    const size = this.total_degrees / 2;
    const temp = this.adjacency_list;
    const [i, j] = startLast;
    const vertex = [...temp.keys()];

    let start = vertex[i], last = vertex[j];
  
    this.doEuler(temp, size, start, last);
  }  

  update(start, last, list) {
    if (list.has(start) && list.has(last)) {
      const startEdges = list.get(start);
      const lastEdges = list.get(last);

      const posLast = startEdges.indexOf(last);
      const posStart = lastEdges.indexOf(start);

      if (posLast !== -1) {
        startEdges.splice(posLast, 1);
      }

      if (posStart !== -1) {
        lastEdges.splice(posStart, 1);
      }
    }

    return list;
  }

  updateSingle(start, list) {
    if (list.has(start)) {
      const startEdges = list.get(start);
      const pos = startEdges.indexOf(start);

      if (pos !== -1) {
        startEdges.splice(pos, 1);
      }
    }

    return list;
  }

  doEuler(temp, size, start, last) {
    let next;
    let i;

    this.euler.push(start);

    do {
      i = 0;
      for (const [node, edges] of temp.entries()) {
        if (node === start) {
          if (edges[i] === last && edges.length > 1) {
            i = 1;
          }

          next = edges[i];
          if (start !== next) {
            temp = this.update(start, next, temp);
          } else {
            temp = this.updateSingle(start, temp);
          }

          size--;
          start = next;
          this.euler.push(start);
          break;
        }
      }
    } while (size > 1);

    this.euler.push(last);
  }

  showGraph() {
    const table = document.getElementById("graphContent");
    const tbody = table.querySelector('tbody'); // Accede al cuerpo de la tabla
  
    while(tbody.firstChild) tbody.removeChild(tbody.firstChild);
  
    for (const [vertex, edges] of this.adjacency_list) {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');

      td1.textContent = `${vertex}`;
      td2.textContent = `${edges}`;

      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
  }
  
  

  async showInformation()
  {
    await this.makeMatrix();

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
    let graphInformation = `Degrees: ${str_degrees}\nTotal Degrees: ${this.total_degrees}\nSymmetrix: ${str_symmetric}\nRelated: ${str_related}\nEulerian: ${str_eulerian}\nType: ${this.type}\nResult: ${this.euler}`;

    document.getElementById("graphInfo").textContent = graphInformation;
  }
}

var graph = new Graph();

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

function clearGraph() {
  const graphContent = document.getElementById('graphContent');
  const graphInfo = document.getElementById('graphInfo');
  graphContent.textContent = '';
  graphInfo.textContent = '';
}

function clearGraphObject() {
  graph = new Graph();

  clearGraph();
}

const clearGraphBtn = document.getElementById('clearGraphBtn');
clearGraphBtn.addEventListener('click', clearGraphObject);
