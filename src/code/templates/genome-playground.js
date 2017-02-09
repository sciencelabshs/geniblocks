import React, { Component, PropTypes } from 'react';
import OrganismGlowView from '../components/organism-glow';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import PenView from '../components/pen';
import ChangeSexButtons from '../components/change-sex-buttons';

export default class GenomeContainer extends Component {

  render() {
    const { drakes, onChromosomeAlleleChange, onSexChange, userChangeableGenes, visibleGenes, hiddenAlleles, onKeepOffspring } = this.props,
          drakeDef = drakes[0].alleleString,
          drakeSex = drakes[0].sex,
          drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef, drakeSex);
    let [,...keptDrakes] = drakes;
    keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));
    let penView = <div className='columns bottom'>
                    <PenView orgs={ keptDrakes } width={500} columns={5} rows={1} tightenRows={20}/>
                  </div>;
    
    const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
      onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
    };

    const handleSexChange = function(newSex) {
      onSexChange(0, newSex);
    };

    const handleSubmit = function() {
      let child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          childImage = child.getImageName(),
          [,...keptDrakes] = drakes,
          success = true;
      for (let drake of keptDrakes) {
        let org = new BioLogica.Organism(BioLogica.Species.Drake, drake.alleleString, drake.sex);
        if (org.getImageName() === childImage) {
          success = false;
          break;
        }
      }
      onKeepOffspring(0, success, 6, true);
    };

    return (
      <div id="genome-playground">
        <div className='column'>
            <ChangeSexButtons id="change-sex-buttons" sex={ drakeSex } onChange= { handleSexChange } showLabel={true} species="Drake" />
            <GenomeView className="drake-genome" org={ drake } onAlleleChange={ handleAlleleChange } userChangeableGenes= { userChangeableGenes } visibleGenes={ visibleGenes } hiddenAlleles={ hiddenAlleles }/>
        </div>
        <div className='column'>
            <OrganismGlowView id="drake-image" org={ drake } />
            <ButtonView label="~BUTTON.SAVE_DRAKE" id="save-button" onClick={ handleSubmit } />
            {penView} 
        </div>
      </div>
    );
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired,
    onKeepOffspring: PropTypes.func.isRequired
  }

  static authoredDrakesToDrakeArray = function(auth) {
    return [auth.initialDrake];
  }
}
