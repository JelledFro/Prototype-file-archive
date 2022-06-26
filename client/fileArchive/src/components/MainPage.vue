
<template>
    <h1> File Archive </h1>
    <el-table :data="pagedTableData" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
        <el-table-column prop="icon" label="" sortable width="70" >
             <template #default="scope">
             <a :href="'http://localhost:3010/file/' + scope.row.id">
              <img :src="fileIcon(scope.row.filename)" /> 
             </a>
             </template>
        </el-table-column>
        <el-table-column prop="filename" label="Filename" sortable width="250" />
        <el-table-column prop="description" label="Description" sortable width="180" />
        <el-table-column prop="date" label="Date" sortable width="100"/>
            <el-table-column fixed="right" label="Delete" width="120">
      <template #default="scope">
        <el-button
          link
          type="danger"
          size="small"
          @click.prevent="deleteRow(scope.row)"
        >
          X
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="this.dataSize" :page-size="this.pageSize" @current-change="setPage"/>

    <div>
        <input type="file" accept=".xml,.pdf,.jpg" ref="file" style="display: block; margin: 10px 0">
        <input type="text" id="filename" v-model="newFile.name" placeholder="Filename" style="display: block; margin: 10px 0x">
        <input type="text" id="description" v-model="newFile.description" placeholder="Description" style="display: block; margin: 10px 0">
        <el-button type="primary" @click="submitFile" style="display: block; margin: 10px 0;">Submit</el-button>
    </div>

</template>

<script>
import 'element-plus/dist/index.css'
import axios from 'axios';
import { ref } from 'vue'

export default {
  data() {
    return {
        tableData: [],
        page: 1,
        pageSize: 5,
        file: '',
        newFile : {
            name: '',
            description: ''
        }
    }
  },
   computed: {
     pagedTableData() {
       return this.tableData.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)
     }, 
     dataSize() {
      return this.tableData.length
     }
   },
  methods: {
    submitFile() {
        const formData = new FormData();
        const file = this.$refs.file.files[0]
        const id =  Date.now()
        formData.append('file', file);
        formData.append('id', id);
        formData.append('filename', this.newFile.name); 
        formData.append('description', this.newFile.description);
        formData.append('date', new Date().toLocaleDateString());
        const headers = { 'Content-Type': 'multipart/form-data' };
        axios.post('http://localhost:3010/file/newfile', formData, { headers }).then((res) => {
          res.data.files; // binary representation of the file
          res.status; // HTTP status
          const newEntry = {
                id: id,
                filename: this.newFile.name,
                description: this.newFile.description,
                date: new Date().toLocaleDateString(),
            }
          this.tableData.push(newEntry)
        });

    },
    getAllFileInfo() {
        axios.get('http://localhost:3010/fileInfo/all')
    .then( (response) => {
        this.tableData = response.data
    })
    },    
    deleteRow(row) {
      axios.delete('http://localhost:3010/file/' + row.id)
      .then( (response) => {
        console.log(response)
        this.tableData = this.tableData.filter(entry => entry.id != row.id)
    })
    },
    fileIcon(filename) {
      const filetype = filename.split('.')[1]
      let iconPath = "./src/assets/"
      switch(filetype) {
        case "pdf":
          iconPath += "pdf_icon.png"
          break;
        case "xml":
          iconPath += "xml_icon.png"
          break;
        case "jpg":
          iconPath += "jpg_icon.png"
          break;
      }
        return iconPath
    },
    setPage (n) {
      this.page = n
  }
  },
    mounted() {
    this.getAllFileInfo()
  }
}
</script>