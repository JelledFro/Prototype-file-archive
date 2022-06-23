
<template>
    <h1> File Archive </h1>
    <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
        <el-table-column prop="icon" label="" sortable width="180" >
            <!-- TODO -->
            <img src="./../assets/pdf_icon.png" @click="getFile" /> 
        </el-table-column>
        <el-table-column prop="filename" label="Filename" sortable width="180" />
        <el-table-column prop="description" label="Description" sortable width="180" />
        <el-table-column prop="date" label="Date" sortable />
            <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button
          link
          type="danger"
          size="small"
          @click.prevent="deleteRow(scope.$index)"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    <div>
        <input type="file" accept=".xml,.pdf,.jpg" ref="file">
        <label for="filename">Filename:</label>
        <input type="text" id="filename" v-model="newFile.name">
        <label for="description">Description:</label>
        <input type="text" id="description" v-model="newFile.description">
        <el-button type="primary" @click="submitFile">Submit</el-button>
    </div>

</template>

<script>
import 'element-plus/dist/index.css'
import axios from 'axios';
import { ref } from 'vue'

// const uploadRef = ref<UploadInstance>()


export default {
  data() {
    return {
        tableData: [
            {
                filename: 'file.pdf',
                description: 'a file',
                date: '2016-05-03',
            },
             {
                filename: 'file2.png',
                description: 'another file',
                date: '2022-11-17',
            }         
        ],
        file: '',
        newFile : {
            name: '',
            description: ''
        }
    }
  },
  methods: {
    submitFile() {
        console.log('sending file')
        console.log(this.newFile.description)
        const formData = new FormData();
        const file = this.$refs.file.files[0]
        formData.append('file', file);
        formData.append('filename', file.name); //TODO: v-model input field and 
        formData.append('description', this.newFile.description);
        formData.append('date', new Date().toLocaleDateString());
        const headers = { 'Content-Type': 'multipart/form-data' };
        axios.post('http://localhost:3010/file/newfile', formData, { headers }).then((res) => {
          res.data.files; // binary representation of the file
          res.status; // HTTP status
        });

    },
    getFile() {
            axios.get('http://localhost:3010/file')
        .then( (response) => {
            console.log(response);
            // TODO: open the file on click
        })
    },
    getFileInfo() {
        axios.get('http://localhost:3010/fileInfo/all')
    .then( (response) => {
        this.tableData = response.data

        //TODO for each findFileExtension() and insert in json object property filetype
    })
    },    
    deleteRow(index) {
        //TODO
    },
    findFileExtension(){
        //TODO
    },
    fileIcon(entry)  {

        //TODO return path to correct icon based on filetype
    }
  },
    mounted() {
    console.log(`the component is now mounted.`)
    this.getFileInfo()
    this.getFile()
  }
}
</script>