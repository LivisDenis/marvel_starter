import React, {Component} from "react";
import MarvelServices from "../../services/MarvelServices";
import PropTypes from "prop-types";
import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        offset: 210,
        newItemLoading: false,
        charEnded: false
    }

    marvelService = new MarvelServices()

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onCharListError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false
        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({offset, charList}) => ({
            charList: [...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onCharListError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref)
    }

    onFocusItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'))
        this.itemRefs[id].classList.add('char__item_selected')
        this.itemRefs[id].focus()
    }

    renderChar = (arr) => {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'}
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'}
            }

            return (
                <li
                    className="char__item"
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onSelectedChar(item.id)
                        this.onFocusItem(i)
                    }}
                >
                    <img src={item.thumbnail} style={imgStyle} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state

        const items = this.renderChar(charList)

        const spinner = loading ? <Spinner/> : null
        const errorChar = error ? <ErrorMessage/> : null
        const content = !(loading || error) ? items : null

        return (
            <div className="char__list">
                {errorChar}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    style={{'display': charEnded ? 'none' : 'block'}}
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired
}

export default CharList;