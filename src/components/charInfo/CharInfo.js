import {Component} from "react";
import MarvelServices from "../../services/MarvelServices";

import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import './charInfo.scss';
import PropTypes from "prop-types";

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    componentDidMount() {
        this.onCharSelected()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.charId !== prevProps.charId) {
            this.onCharSelected()
        }
    }

    marvelService = new MarvelServices()

    onCharSelected = () => {
        const {charId} = this.props
        if (!charId) {
            return
        }

        this.onCharLoading()
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char, loading, error} = this.state

        const skeleton = char || loading || error ? null : <Skeleton/>
        const spinner = loading ? <Spinner/> : null
        const errorMessage = error ? <ErrorMessage/> : null
        const content = !(loading || errorMessage || !char) ? <View char={char}/> : null

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char

    let imgSize = {'objectFit': 'cover'}
    if (thumbnail.includes('image_not_available')) imgSize = {'objectFit': 'unset'}

    const comicsItem = comics.map((item, i) => {
        if (i > 7) return
        return (
            <li key={i} className="char__comics-item">
                {item.name}
            </li>
        )
    })

    return (
        <>
            <div className="char__basics">
                <img style={imgSize} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? comicsItem : 'There is no comics with this character ('}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}


export default CharInfo;