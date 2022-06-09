import * as THREE from "three";

export default class Floor {
	constructor(experience) {
		this.experience = experience;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;

		this.setGeometry();
		this.setTextures();
		this.setMaterial();
		this.setMesh();
	}

	setGeometry() {
		this.geometry = new THREE.CircleGeometry(5, 64);
	}
	setTextures() {
		this.textures = {};
		this.textures.color = this.resources.items.grassColorTexture;
		this.textures.color.encoding = THREE.sRGBEncoding;
		this.textures.color.repeat.set(1.5, 1.5);
		this.textures.color.wrapS = THREE.RepeatWrapping;
		this.textures.color.wrapT = THREE.RepeatWrapping;

		this.textures.normal = this.resources.items.grassNormalTexture;
		this.textures.normal.repeat.set(1.5, 1.5);
		this.textures.normal.wrapS = THREE.RepeatWrapping;
		this.textures.normal.wrapT = THREE.RepeatWrapping;

		this.textures.custom = this.resources.items.customShader;
		// this.textures.custom.repeat.set(2.5, 2.5);
		// this.textures.custom.wrapS = THREE.RepeatWrapping;
		// this.textures.custom.wrapT = THREE.RepeatWrapping;
	}
	setMaterial() {
		this.material = new THREE.ShaderMaterial({
			vertexShader: `
			varying vec2 vUv;		
			void main(){
				vUv = uv;
				vec4 modelPosition = modelMatrix * vec4(position, 1.0);
				vec4 viewPosition = viewMatrix * modelPosition;
				vec4 projectedPosition = projectionMatrix * viewPosition;
				gl_Position = projectedPosition;	
			}
			`,
			fragmentShader: `
			varying vec2 vUv;
			uniform sampler2D utexture;
			uniform float utime;
			mat2 rotation2d(float angle) {
				float s = sin(angle);
				float c = cos(angle);
			
				return mat2(
					c, -s,
					s, c
				);
			}
			float rand(vec2 n) { 
				return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
			}
			void main() {
				vec2 distortion = 0.04*vec2(sin(utime),sin(utime*4.0));
				distortion *= mix(0.2,1.1,rand(vUv));
				vec4 redChannel = texture2D(utexture, vUv+distortion*rotation2d(1.0));
				redChannel.g = 0.0;
				redChannel.b = 0.0;

				vec4 greenChannel = texture2D(utexture, vUv);
				greenChannel.r = 0.0;
				greenChannel.b = 0.0;

				vec4 blueChannel = texture2D(utexture, vUv-distortion*rotation2d(3.0));
				blueChannel.g = 0.0;
				blueChannel.r = 0.0;

				vec4 color = redChannel+greenChannel+blueChannel;
				// color.r = sin(utime+distortion.x);
				gl_FragColor = color;
			}
			`,
			// map: this.textures.custom,
			// normalMap: this.textures.normal,
			uniforms: {
				utexture: { value: this.textures.custom },
				utime: { value: 0 },
			},
		});
		console.log(this);
	}
	setMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.rotation.x = -Math.PI / 2;
		this.mesh.receiveShadow = true;
		this.scene.add(this.mesh);
	}

	update() {
		this.material.uniforms.utime.value = this.time.elapsed / 1000;
		// console.log(this.time.elapsed / 1000);
	}
}
