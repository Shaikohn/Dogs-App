import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../../components/NavBar';
import { getTemperament, postDog } from '../../redux/actions';
import styles from "./index.module.css"
import Swal from "sweetalert2"
import addBreedImage from "../../addBreed.jpg"

function validate(value) {
    let errors = {}

    // Image
    if (!value.image) {
        errors.image = "An image is required!"
    }

    // Name
    if (!value.name) {
        errors.name = "Name is required!"
    } else if(!/[A-Z]+$/i.test(value.name)) {
        errors.name = 'The name should only contain letters!'
    } else if(parseInt(value.name.length) >= 25) {
        errors.name= 'The name should contain less than 25 characters!'
    }
    //Life Span Max
    if (!value.life_span_max) {
        errors.life_span_max = "Life span max is required!"
    } else if(!/^[0-9]+$/.test(value.life_span_max)) {
        errors.life_span_max = 'The max should only contain numbers!'
    }
    // Life Span Min
    if (!value.life_span_min) {
        errors.life_span_min = "Life span min is required!"
    } else if(parseInt(value.life_span_min) < 0) {
        errors.life_span_min = 'The min should be more than 0 years!'
    } else if(parseInt(value.life_span_min) >= parseInt(value.life_span_max)) {
        errors.weight_min= 'The min should be less than the max!'
    } else if(!/^[0-9]+$/.test(value.life_span_min)) {
        errors.life_span_min = 'The min should only contain numbers!'
    }
    // Weight Max
    if (!value.weight_max) {
        errors.weight_max = "Weight max is required!"
    } else if(parseInt(value.weight_max) > 90) {
        errors.weight_max = 'The max should be less than 90 KG!'
    } else if(!/^[0-9]+$/.test(value.weight_max)) {
        errors.weight_max = 'The max should only contain numbers!'
    }
    // Weight Min
    if (!value.weight_min) {
        errors.weight_min = "Weight min is required!"
    } else if(parseInt(value.weight_min) < 0) {
        errors.weight_max = 'The min should be more than 0 KG!'
    } else if(parseInt(value.weight_min) >= parseInt(value.weight_max)) {
        errors.weight_min= 'The min should be less than the max!'
    } else if(!/^[0-9]+$/.test(value.weight_min)) {
        errors.weight_min = 'The min should only contain numbers!'
    }
    // Height Max
    if (!value.height_max) {
        errors.height_max = "Height max is required!"
    } else if(parseInt(value.height_max) > 85) {
        errors.height_max = 'The max should be less than 85 CM!' 
    } else if(!/^[0-9]+$/.test(value.height_max)) {
        errors.height_max = 'the max should only contain numbers!'
    }
    // Height Min
    if (!value.height_min) {
        errors.height_min = "Height min is required!"
    } else if(parseInt(value.height_min) < 0) {
        errors.weight_max = 'The min should be more than 0 KG!'
    } else if(parseInt(value.height_min) >= parseInt(value.height_max)) {
        errors.height_min = 'The min should be less than the max!'
    } else if(!/^[0-9]+$/.test(value.height_min)) {
        errors.height_min = 'The min should only contain numbers!'
    }
    // Temperament
    if(value.temperament.length === 0) {
        errors.temperament = "At least one temperament is required!"
    }
    return errors
}

export default function Create() {
    const dispatch = useDispatch()
    const temperaments = useSelector(state => state.temperaments)
    const [errors, setErrors] = useState({});
    const [selectNameState, setSelectNameState] = useState([])
    const [input, setInput] = useState({
        image:"",
        name: "",
        height_min: "",
        height_max: "",
        weight_min: "",
        weight_max: "",
        life_span_min: "",
        life_span_max: "",
        temperament: []
    })

    useEffect(()=> {
    dispatch(getTemperament())
    }, [dispatch])

    function handleChange(e){
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
        setErrors(validate({
            ...input,
            [e.target.name]: e.target.value
        }))
    }

    function handleSelect(e){

        if(input.temperament.includes(e.target.value)) return
    
        setInput({
            ...input,
            temperament: [...input.temperament, e.target.value]
        })
        setErrors(validate({
            ...input,
            [e.target.name]: e.target.value
        }))
    
        const selectName = e.target.value;
        if(selectName === "default") return;
        setInput({...input , temperament:[...input.temperament, selectName]})
        setSelectNameState([...selectNameState, temperaments.find(e => e.id === parseInt(selectName))])
    }

    function handleSubmit(e){
        e.preventDefault();
        if(!errors.name && !errors.height_min && !errors.height_max &&!errors.weight_min && !errors.weight_max && !errors.life_span_min && !errors.life_span_max && !errors.temperament) {
                dispatch(postDog(input))
                setInput({
                    image:"",
                    name: "",
                    height_min: "",
                    height_max: "",
                    weight_min: "",
                    weight_max: "",
                    life_span_min: "",
                    life_span_max: "",
                    temperament: []
                })
                setSelectNameState([])
                Swal.fire({
                    title: "Success",
                    text: 'Dog created!',
                    icon: "success",
                    timer: 3000,
                });
        } else {
            Swal.fire({
                title: "Error",
                text: 'Complete all the info!',
                icon: "error",
                timer: 3000,
            });
        } 
    }

    function handleDelete(e) {
        setInput({...input, temperament : input.temperament.filter(t => t !== e.target.value)})
        setSelectNameState(selectNameState.filter(t => t.id !== parseInt(e.target.value)))
    }

    return (
        <div>
            <NavBar />
            <div className={styles.fullContainer}>
            <form className={styles.form} onSubmit={handleSubmit} >
                <h1 className={styles.title}>Add a breed!</h1>
                <div style={{display: 'flex'}}>
                    <label className={`${styles.label} ${styles.marginLabel}`} htmlFor="name">Name</label> 
                    <label className={`${styles.label} ${styles.marginLabel}`} htmlFor="image">Image</label>
                </div>
                <div style={{display: 'flex'}} className={styles.container}>
                    <input autoComplete="off" className={styles.inputs} name="name" type="text" placeholder='Name' value={input.name} onChange={handleChange}  />
                    <input autoComplete="off" className={styles.inputs} type="text" name="image" onChange={handleChange} placeholder="Insert an URL" value={input.image} />
                </div>
                <div className={styles.labelsContainer}>
                    <label className={styles.label} style={{marginLeft: '60px'}} htmlFor="life_span">Life Span</label>
                    <label className={styles.label} style={{marginLeft: '50px'}} htmlFor="weight">Weight (KG)</label>
                    <label className={styles.label} style={{marginLeft: '33px'}} htmlFor="height">Height (CM)</label>
                </div>
                <div className={styles.container}>
                    <div className={styles.groupsContainer}>
                        <input autoComplete="off" className={styles.groupsInputs} name="life_span_min" type="text" placeholder='Min' value={input.life_span_min} onChange={handleChange} />
                        <input autoComplete="off" className={styles.groupsInputs} name="life_span_max" type="text" placeholder='Max' value={input.life_span_max} onChange={handleChange} />
                        <input autoComplete="off" className={styles.groupsInputs} name="weight_min" type="text" placeholder='Min' value={input.weight_min} onChange={handleChange} />
                        <input autoComplete="off" className={styles.groupsInputs} name="weight_max" type="text" placeholder='Max' value={input.weight_max} onChange={handleChange} /> 
                        <input autoComplete="off" className={styles.groupsInputs} name="height_min" type="text" placeholder='Min' value={input.height_min} onChange={handleChange} />
                        <input autoComplete="off" className={styles.groupsInputs} name="height_max" type="text" placeholder='Max' value={input.height_max} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.mobileLabels}>
                    <label className={styles.label} style={{marginLeft: '30px'}} htmlFor="life_span">Life Span</label>
                    <label className={styles.label} htmlFor="weight">Weight (KG)</label>
                    <label className={styles.label} htmlFor="height">Height (CM)</label>
                </div>
                <div className={styles.container}>
                    <div className={styles.mobileContainer}>
                        <div>
                        <input autoComplete="off" className={styles.mobileInputs} name="life_span_min" type="text" placeholder='Min' value={input.life_span_min} onChange={handleChange} />
                        <input autoComplete="off" className={styles.mobileInputs} name="weight_min" type="text" placeholder='Min' value={input.weight_min} onChange={handleChange} />
                        <input autoComplete="off" className={styles.mobileInputs} name="height_min" type="text" placeholder='Min' value={input.height_min} onChange={handleChange} />
                        </div>
                        <div>
                        <input autoComplete="off" className={styles.mobileInputs} name="life_span_max" type="text" placeholder='Max' value={input.life_span_max} onChange={handleChange} />
                        <input autoComplete="off" className={styles.mobileInputs} name="weight_max" type="text" placeholder='Max' value={input.weight_max} onChange={handleChange} /> 
                        <input autoComplete="off" className={styles.mobileInputs} name="height_max" type="text" placeholder='Max' value={input.height_max} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className={styles.container}>
                    <label className={`${styles.label} ${styles.marginTemperaments}`} htmlFor="temperament">Temperaments</label>
                    <select className={styles.temperamentInput} name="temperament"  type="text" multiple={true} placeholder='temperament' value={input.temperament} onChange={handleSelect}>
                    {
                        temperaments.map((t) => {
                            return (
                                <option className={styles.temperamentOption} key={t.id} value={t.id} > {t.name} </option>
                            )
                        })
                    }
                    </select>
                    {selectNameState.map((e, i) => {
                return(
                <li className={styles.temperamentList} key={i}>
                    {e.name}
                    <button className={styles.temperamentDelete}  type='button' value={e.id} onClick={handleDelete}>x</button>
                </li>
                    )
                })}
                </div>
                <div className={styles.container}>
                    <input className={styles.submit} type="submit" value="Create a new breed" />
                </div>
            </form>
            {
                Object.keys(errors).length > 0 ?
                <div className={styles.errorsContainer}>
                <p className={styles.errors}> {errors.name} </p>
                <p className={styles.errors}> {errors.image} </p>
                <p className={styles.errors}> {errors.life_span_min} </p>
                <p className={styles.errors}> {errors.life_span_max} </p>
                <p className={styles.errors}> {errors.weight_min} </p>
                <p className={styles.errors}> {errors.weight_max} </p>
                <p className={styles.errors}> {errors.height_min} </p>
                <p className={styles.errors}> {errors.height_max} </p>
                <p className={styles.errors}> {errors.temperament} </p>
            </div> : ''
            }
            <img className={styles.image} src={addBreedImage} alt='Add a breed' />
        </div>
        </div>
    )
}