from DeepPurpose import utils, dataset
from DeepPurpose import DTI as models
import warnings
warnings.filterwarnings("ignore")
X_drugs, X_targets, y = dataset.read_file_training_dataset_drug_target_pairs('./toy_data/dti.txt')
print('Drug 1: ' + X_drugs[0])
print('Target 1: ' + X_targets[0])
print('Score 1: ' + str(y[0]))
