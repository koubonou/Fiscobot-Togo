// Base de Connaissances Fiscale - Senegal
// Source : Code General des Impots Senegal (CGI DGID) 2025
// Direction Generale des Impots et Domaines (DGID)
// Loi de Finances 2026 Senegal

export const KB_SENEGAL = [

  `=== SEN-01 | GENERALITES | SYSTEME FISCAL SENEGALAIS 2025 ===
TITRE: Systeme fiscal senegalais - Vue d'ensemble 2025
PRINCIPE: Le Senegal dispose d'un systeme fiscal administre par la Direction Generale des Impots et Domaines (DGID). Le pays est membre de l'UEMOA et de l'OHADA.
DETAILS:
- Autorite fiscale : Direction Generale des Impots et Domaines (DGID)
- Site officiel : www.impotsetdomaines.gouv.sn
- Monnaie : Franc CFA (XOF)
- Zone UEMOA : Oui - directives communautaires applicables
- Zone OHADA : Oui - SYSCOHADA applicable
- Principaux impots : IS, IRPP, TVA, CFE, CFU, Patente, CGU
- Declarations en ligne : portail e-tax DGID
REFERENCES: CGI Senegal 2025 | DGID`,

  `=== SEN-02 | CGI | CODE GENERAL DES IMPOTS SENEGAL - STRUCTURE ===
TITRE: Code General des Impots Senegal (CGI) - Structure et organisation
PRINCIPE: Le CGI senegalais est le texte de reference qui regroupe l'ensemble des dispositions fiscales applicables au Senegal. Il est administre par la DGID.
STRUCTURE DU CGI SENEGAL:
- Livre 1 : Impots directs (IS, IRPP, BIC, BNC, Revenus fonciers)
  * Art. 1 a 240 : Impots sur les revenus
  * Art. 241 a 360 : Impots sur les societes et assimiles
- Livre 2 : Impots indirects (TVA, droits d'accises)
  * Art. 355 a 520 : TVA
  * Art. 521 a 570 : Droits d'accises
- Livre 3 : Taxes et droits divers
  * Art. 571 a 617 : Patente
  * Art. 618 a 665 : Taxes locales
- Livre 4 : Contribution Globale Unique (CGU)
  * Art. 669 a 680 : Regime des petites entreprises
- Livre 5 : Droits d'enregistrement et de timbre
  * Art. 462 a 516 : Enregistrement
- Livre des Procedures Fiscales (LPF) : Controle et contentieux
MODIFICATIONS RECENTES:
- Loi de Finances 2025 : renforcement controles prix de transfert
- Loi de Finances 2026 : facturation electronique, incitations investissement
REFERENCES: CGI Senegal 2025 | Ministere des Finances et du Budget Senegal`,

  `=== SEN-03 | IS | IMPOT SUR LES SOCIETES - SENEGAL 2025 ===
TITRE: Impot sur les Societes (IS) Senegal - Taux 30% et calcul
PRINCIPE: L'IS frappe les benefices realises par les societes et personnes morales au Senegal. Taux : 30% (vs 27% au Togo).
TAUX IS SENEGAL:
- Taux normal : 30% du benefice imposable
- Taux reduit PME : 15% si CA annuel < 250 millions FCFA ET capital detenu a 100% par residents senegalais
- Taux reduit Zone Franche : variable selon regime (0% a 15% selon periode)
MINIMUM FORFAITAIRE DE PERCEPTION (MFP):
- Taux MFP : 0,5% du CA HT annuel
- Minimum absolu : 500 000 FCFA
- Exigible meme en cas de deficit ou d'IS nul
- Imputable sur l'IS de l'exercice
ASSIETTE DE CALCUL IS:
- Benefice net = Produits - Charges deductibles
- Exercice : 1er janvier au 31 decembre
ACOMPTES PROVISIONNELS IS:
- 4 acomptes trimestriels = 25% x IS annee N-1
- Echeances : 15 mars, 15 juin, 15 septembre, 15 decembre
- Solde IS : avant le 30 avril de l'annee N+1
CHARGES DEDUCTIBLES:
- Amortissements lineaires ou degressifs (memes regles SYSCOHADA)
- Charges de personnel limitees aux remunerations normales
- Interets d'emprunts dans la limite du taux du marche
- Pertes et provisions justifiees
CHARGES NON DEDUCTIBLES:
- Amendes et penalites fiscales
- Impot sur les societes lui-meme
- Liberalites et dons (sauf dons ONG agreees < 0,5% du CA)
COMPARATIF TOGO vs SENEGAL:
- Togo IS : 27% | Senegal IS : 30%
- Togo MFP : 1% CA | Senegal MFP : 0,5% CA (min 500 000 FCFA)
REFERENCES: Art. 241 a 300 CGI Senegal | DGID`,

  `=== SEN-04 | TVA | TAXE SUR LA VALEUR AJOUTEE SENEGAL - DETAIL ===
TITRE: TVA Senegal - Regime complet 2025
PRINCIPE: La TVA senegalaise est un impot indirect sur la consommation au taux de 18%, identique au Togo.
TAUX TVA SENEGAL:
- Taux normal : 18% (identique au Togo)
- Taux zero (0%) : exportations de biens et services, operations assimilees
- Taux reduit : pas de taux reduit intermediaire au Senegal
EXONERATIONS TVA IMPORTANTES:
- Produits alimentaires de base : riz, pain, lait, hile, sucre
- Medicaments et produits pharmaceutiques
- Prestations d'enseignement et de formation professionnelle
- Soins medicaux et hospitaliers
- Operations bancaires et d'assurance
- Locations d'immeubles nus a usage d'habitation
- Produits agricoles non transformes
- Presse ecrite et livres
SEUIL D'ASSUJETTISSEMENT TVA:
- Regime du reel : CA annuel > 50 millions FCFA
- Seuil Togo : 100 millions FCFA (Senegal seuil 2x plus bas)
- En dessous de 50M FCFA : regime CGU (Contribution Globale Unique)
DECLARATION TVA:
- Mensuelle avant le 15 du mois suivant (regime reel)
- Trimestrielle pour certains regimes simplifies
- Via portail e-tax DGID
TVA DEDUCTIBLE:
- TVA sur achats de biens et services utilises pour l'activite taxee
- Prorata de deduction si activites mixtes (taxees + exonerees)
- Compte SYSCOHADA 4452 : TVA recuperable sur achats
- Compte SYSCOHADA 4441 : TVA collectee sur ventes
CREDIT DE TVA:
- Remboursable si credit > 25 millions FCFA
- Delai de remboursement DGID : 3 mois maximum
- Conditions : exportateurs, entreprises nouvelles, investissements importants
REFERENCES: Art. 355 a 520 CGI Senegal | DGID`,

  `=== SEN-05 | ENTREPRENANT | REGIME DE L'ENTREPRENANT SENEGALAIS ===
TITRE: Regime de l'Entreprenant au Senegal - CGU et statut OHADA
PRINCIPE: Le regime de l'entreprenant au Senegal correspond a la Contribution Globale Unique (CGU) pour les petites entites dont le CA est inferieur au seuil TVA de 50 millions FCFA.
STATUT JURIDIQUE ENTREPRENANT (OHADA):
- Defini par l'Art. 30 de l'Acte Uniforme OHADA sur le droit commercial general
- Personne physique exer\u00e7ant une activite professionnelle civile, commerciale, artisanale ou agricole
- Immatriculation simplifiee au RCCM
- Comptabilite simplifiee (livre de recettes-depenses uniquement)
- Protection du patrimoine personnel limites
CONTRIBUTION GLOBALE UNIQUE (CGU) - REGIME FISCAL:
Seuil d'application : CA annuel < 50 millions FCFA
La CGU remplace simultanement :
- IS ou IRPP (impot sur le revenu/benefice)
- TVA (taxe sur la valeur ajoutee)
- Patente (contribution professionnelle)
- Contribution Fonciere des Etablissements (CFE)
TAUX CGU PAR SECTEUR:
- Commerce (achat-revente) : 4% du CA annuel
- Prestations de services : 6% du CA annuel
- Artisanat et petite industrie : 3% du CA annuel
- Agriculture et peche : 2% du CA annuel
MINIMUM CGU:
- Minimum absolu : 100 000 FCFA/an
PAIEMENT CGU:
- Paiement trimestriel : 25% chaque trimestre
- Echeances : 15 janvier, 15 avril, 15 juillet, 15 octobre
- Paiement en especes ou mobile money
OBLIGATIONS COMPTABLES SIMPLIEES:
- Livre de recettes et depenses
- Conservation des justificatifs 5 ans
- Pas d'obligation d'etablir des etats financiers SYSCOHADA complets
DIFFERENCES AVEC TOGO:
- Togo : TPU (Taxe Professionnelle Unique) = concept equivalent
- Senegal CGU : seuil 50M FCFA | Togo TPU : seuil 30M FCFA
- Les deux incluent IS + TVA + patente dans un seul impot
PASSAGE AU REGIME REEL:
- Obligatoire si CA depasse 50 millions FCFA pendant 2 annees consecutives
- Option volontaire possible sur demande a la DGID
REFERENCES: Art. 669 a 680 CGI Senegal | Art. 30 AUDCG OHADA | DGID`,

  `=== SEN-06 | LF2026 | LOI DE FINANCES 2026 SENEGAL - DETAIL ===
TITRE: Loi de Finances 2026 Senegal - Mesures fiscales cles
PRINCIPE: La loi de finances 2026 du Senegal s'inscrit dans un contexte de consolidation budgetaire sous le nouveau gouvernement. Elle introduit plusieurs reformes fiscales significatives.
CONTEXTE BUDGETAIRE 2026:
- Budget 2026 : environ 6 000 milliards FCFA
- Objectif pression fiscale : 20% du PIB (norme UEMOA)
- Priorite : mobilisation ressources internes et reduction dependance aide exterieure
MESURES FISCALES LF2026 SENEGAL:
1. FACTURATION ELECTRONIQUE:
- Introduction obligatoire de la facturation electronique certifiee pour les entreprises du regime reel
- Calendrier de mise en oeuvre progressif (grandes entreprises d'abord)
- Objectif : reduire la fraude TVA et ameliorer la tracabilite
2. IS ET INCITATIONS INVESTISSEMENT:
- Maintien taux IS a 30%
- Nouvelles incitations fiscales pour investissements dans energies renouvelables
- Credit d'impot pour emploi de personnes handicapees (similaire LF2026 Togo)
- Deduction acceleree des investissements en equipements productifs
3. PRIX DE TRANSFERT:
- Renforcement des obligations documentaires pour les multinationales
- Seuil de declaration : transactions > 500 millions FCFA avec parties liees
- Alignement sur les standards OCDE (BEPS)
4. TVA ET NUMERIQUE:
- Assujettissement TVA des plateformes numeriques etrangeres vendant au Senegal
- Mecanisme de collecte TVA par les plateformes (type Art. 183 CGI Togo)
- Extension du champ d'application TVA aux services numeriques
5. CGU ET PETITES ENTREPRISES:
- Harmonisation des taux CGU par secteur
- Simplification des procedures de declaration pour l'entreprenant
- Promotion du paiement mobile (Wave, Orange Money) pour la CGU
6. CONTROLE FISCAL:
- Renforcement des moyens de la Brigade de Verification DGID
- Extension de l'assistance administrative internationale (DAC)
- Sanctions renforcees pour fraude fiscale caracterisee
BUDGET SENEGAL 2026 - CHIFFRES CLES:
- Recettes fiscales : environ 3 500 milliards FCFA
- Pression fiscale : 19,2% du PIB (cible)
- Croissance prevue : 8,5% (dont impact petrole/gaz)
REFERENCES: Loi de Finances 2026 Senegal | Ministere des Finances | DGID`,

  `=== SEN-07 | IRPP | IMPOT SUR LE REVENU - SENEGAL ===
TITRE: IRPP Senegal - Impot sur le Revenu des Personnes Physiques
BAREME IRPP SENEGAL 2025:
- Tranche 1 : 0 a 630 000 FCFA : 0%
- Tranche 2 : 630 001 a 1 500 000 FCFA : 20%
- Tranche 3 : 1 500 001 a 4 000 000 FCFA : 30%
- Tranche 4 : 4 000 001 a 8 000 000 FCFA : 35%
- Tranche 5 : Au-dela de 8 000 000 FCFA : 40%
CATEGORIES DE REVENUS:
- BIC (Benefices Industriels et Commerciaux)
- BNC (Benefices Non Commerciaux) : professions liberales
- Revenus fonciers : loyers et revenus immobiliers
- Revenus de capitaux mobiliers : dividendes, interets
- Traitements et salaires
RETENUE A LA SOURCE SUR SALAIRES:
- Employeur preleve et reverse mensuellement avant le 15
- Abattements : frais professionnels 20% du salaire brut (max 900 000 FCFA/an)
REFERENCES: Art. 81 a 240 CGI Senegal | DGID`,

  `=== SEN-08 | RETENUES SOURCE | RETENUES A LA SOURCE - SENEGAL ===
TITRE: Retenues a la source - Senegal 2025
PRINCIPAUX TAUX RETENUES:
- Dividendes (residents et non-residents) : 10%
- Interets sur depots et obligations : 8%
- Redevances versees a des non-residents : 20%
- Prestations de services non-residents : 20%
- Loyers verses a des personnes physiques : 5%
- Commissions, honoraires (residents) : 3%
- Marches publics > 500 000 FCFA : 3%
- Gains jeux de hasard : 15%
REVERSEMENT : avant le 15 du mois suivant via e-tax DGID
REFERENCES: Art. 240 bis a 240 octies CGI Senegal | DGID`,

  `=== SEN-09 | PATENTE | CONTRIBUTION PATENTE - SENEGAL ===
TITRE: Contribution des Patentes - Senegal
PRINCIPE: Due par toute entreprise du regime reel exer\u00e7ant une activite commerciale, industrielle ou liberale.
DETAILS:
- Calcul : droit fixe + droit proportionnel sur valeur locative des locaux
- Exoneration la 1ere annee d'activite
- Declaration avant le 31 mars de chaque annee
- Les entreprises CGU sont exonerees de patente
REFERENCES: Art. 571 a 617 CGI Senegal | DGID`,

  `=== SEN-10 | FONCIER | CONTRIBUTION FONCIERE - SENEGAL ===
TITRE: Contribution Fonciere des Proprietes (CFB/CFU) - Senegal
CFB (Proprietes Baties) : 5% de la valeur locative annuelle
CFU (Proprietes Non Baties) : 5% de la valeur venale
Exonerations : habitation principale, batiments agricoles, proprietes etat
REFERENCES: Art. 517 a 570 CGI Senegal | DGID`,

  `=== SEN-11 | ENREGISTREMENT | DROITS D'ENREGISTREMENT - SENEGAL ===
TITRE: Droits d'enregistrement - Senegal 2025
PRINCIPAUX TAUX:
- Cession fonds de commerce : 5%
- Cession immeubles : 5% de la valeur venale
- Cession actions SA : 1%
- Cession parts SARL : 2%
- Baux commerciaux : 2% du loyer annuel
- Contrats de pret : 1%
- Constitution de societe : droit fixe 25 000 FCFA
- Augmentation de capital : 1%
DELAI : actes sous seing prive 30 jours | actes notaries : immediat
REFERENCES: Art. 462 a 516 CGI Senegal | DGID`,

  `=== SEN-12 | IPRES | COTISATIONS SOCIALES - SENEGAL ===
TITRE: Cotisations sociales IPRES et CSS - Senegal
IPRES (Institut de Prevoyance Retraite du Senegal):
- Regime general : Patronal 8,4% + Salarial 5,6% = 14% (plafond 360 000 FCFA/mois)
- Regime cadres : Patronal 3,6% + Salarial 2,4% = 6% (plafond 1 296 000 FCFA/mois)
CSS (Caisse de Securite Sociale):
- Prestations familiales : 7% patronal (plafond 63 000 FCFA/mois)
- Accidents du travail : 1% a 5% selon secteur (charge patronale)
DECLARATION ET PAIEMENT: mensuel avant le 15
REFERENCES: Code Securite Sociale Senegal | IPRES | CSS`,

  `=== SEN-13 | CONTROLE | CONTROLE FISCAL SENEGAL ===
TITRE: Controle fiscal et procedures DGID - Senegal
TYPES DE CONTROLE:
- Controle sur pieces (bureau)
- Verification de comptabilite (en entreprise)
- Examen Situation Fiscale Personnelle (ESFP)
DELAIS DE PRESCRIPTION:
- Droit de reprise general : 3 ans
- En cas de fraude : 6 ans
DROITS DU CONTRIBUABLE:
- Droit de reponse : 30 jours
- Commission de Conciliation
- Recours hierarchique DGI
- Recours contentieux tribunal
SANCTIONS:
- Penalites de retard : 5% par mois (max 25%)
- Amendes defaut declaration : 50 000 a 500 000 FCFA
REFERENCES: LPF Senegal | DGID`,

  `=== SEN-14 | SYSCOHADA | SYSCOHADA AU SENEGAL ===
TITRE: Application SYSCOHADA au Senegal
PRINCIPE: Identique au Togo - meme referentiel AUDCIF 2017.
DETAILS:
- Classes 1 a 9 identiques au Togo
- Memes etats financiers obligatoires
- Depot etats financiers : DGID + RCCM avant 30 avril
- Organisme professionnel : ONECS (Ordre National Experts Comptables Senegal)
- Pas de GUDEF au Senegal (contrairement au Togo)
REFERENCES: AUDCIF OHADA 2017 | DGID | ONECS`,

  `=== SEN-15 | COMPARATIF | TOGO vs SENEGAL - TABLEAU COMPARATIF ===
TITRE: Comparaison fiscale complete Togo vs Senegal
IS:
- Togo : 27% | Senegal : 30%
- MFP Togo : 1% CA | MFP Senegal : 0,5% CA (min 500 000 FCFA)
TVA:
- Taux : 18% (identique)
- Seuil Togo : 100M FCFA | Seuil Senegal : 50M FCFA
PETIT REGIME:
- Togo : TPU | Senegal : CGU - meme concept
RETENUES DIVIDENDES:
- Togo : 13% residents | Senegal : 10%
- Togo : 15% non-residents | Senegal : 10%
ORGANES FISCAUX:
- Togo : OTR | Senegal : DGID
DECLARATIONS EN LIGNE:
- Togo : e-tax OTR | Senegal : e-tax DGID
DEPOT ETATS FINANCIERS:
- Togo : GUDEF | Senegal : DGID directement
COMPTABILITE:
- Les deux pays : SYSCOHADA Revise 2017 (identique)
LF2026 POINTS COMMUNS:
- Facturation electronique certifiee (les deux pays)
- TVA plateformes numeriques (les deux pays)
- Incitations investissements (les deux pays)
REFERENCES: CGI Togo 2025 | CGI Senegal 2025 | SYSCOHADA 2017`,

];

export const KB_SENEGAL_N = KB_SENEGAL.length;

export function searchKBSENEGAL(query, topK) {
  topK = topK || 3;
  var q = query.toLowerCase();
  var tokens = q.split(/\s+/).filter(function(t){ return t.length > 2; });
  return KB_SENEGAL
    .map(function(sec){
      var s = sec.toLowerCase();
      var score = tokens.reduce(function(acc, t){ return acc + (s.split(t).length - 1); }, 0);
      return { sec: sec, score: score };
    })
    .filter(function(x){ return x.score > 0; })
    .sort(function(a, b){ return b.score - a.score; })
    .slice(0, topK)
    .map(function(x){ return x.sec; });
}
